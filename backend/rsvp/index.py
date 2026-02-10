import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для сохранения ответов гостей и отправки уведомлений на почту'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }

    if method == 'POST':
        try:
            body = json.loads(event.get('body', '{}'))
            guest_name = body.get('name', '').strip()
            will_attend = body.get('will_attend', False)

            if not guest_name:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Имя гостя обязательно'}),
                    'isBase64Encoded': False
                }

            db_url = os.environ.get('DATABASE_URL')
            schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
            
            conn = psycopg2.connect(db_url)
            cursor = conn.cursor()
            
            cursor.execute(
                f'INSERT INTO {schema}.guests (name, will_attend) VALUES (%s, %s) RETURNING id',
                (guest_name, will_attend)
            )
            guest_id = cursor.fetchone()[0]
            conn.commit()
            
            cursor.close()
            conn.close()

            try:
                send_email_notification(guest_name, will_attend)
            except Exception as e:
                print(f'Email notification failed: {e}')

            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'guest_id': guest_id}),
                'isBase64Encoded': False
            }

        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }

    if method == 'GET':
        try:
            db_url = os.environ.get('DATABASE_URL')
            schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
            
            conn = psycopg2.connect(db_url)
            cursor = conn.cursor()
            
            cursor.execute(f'SELECT id, name, will_attend, created_at FROM {schema}.guests ORDER BY created_at DESC')
            rows = cursor.fetchall()
            
            guests = []
            for row in rows:
                guests.append({
                    'id': row[0],
                    'name': row[1],
                    'will_attend': row[2],
                    'created_at': row[3].isoformat() if row[3] else None
                })
            
            cursor.close()
            conn.close()

            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'guests': guests}),
                'isBase64Encoded': False
            }

        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }

    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }


def send_email_notification(guest_name: str, will_attend: bool):
    '''Отправка email уведомления о новом ответе гостя'''
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_email = os.environ.get('SMTP_EMAIL')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    notify_email = os.environ.get('NOTIFY_EMAIL')

    if not all([smtp_host, smtp_email, smtp_password, notify_email]):
        raise Exception('SMTP настройки не заполнены')

    status = 'ПРИДЁТ ✨' if will_attend else 'Не придёт'
    
    msg = MIMEMultipart()
    msg['From'] = smtp_email
    msg['To'] = notify_email
    msg['Subject'] = f'Новый ответ: {guest_name} — {status}'

    body = f'''
Привет, Алёна!

Новый ответ на приглашение:

👤 Имя: {guest_name}
📅 Статус: {status}

---
Приглашение "Собрание волшебниц"
21 февраля, 18:00
    '''

    msg.attach(MIMEText(body, 'plain', 'utf-8'))

    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()
    server.login(smtp_email, smtp_password)
    server.send_message(msg)
    server.quit()

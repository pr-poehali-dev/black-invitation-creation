import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [rsvp, setRsvp] = useState<'yes' | 'no' | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-02-21T18:00:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRSVP = (response: 'yes' | 'no') => {
    setRsvp(response);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
        <div className="text-center max-w-2xl">
          <div className="mb-8">
            <h1 className="font-cormorant text-[12rem] md:text-[16rem] font-light leading-none tracking-tight">
              45
            </h1>
            <div className="relative">
              <Separator className="bg-white w-64 mx-auto my-4" />
              <p className="font-montserrat text-sm md:text-base tracking-[0.3em] uppercase mt-6">
                Белая вечеринка
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-2 text-white/40 animate-pulse">
          <Icon name="ChevronDown" size={24} />
        </div>
      </section>

      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-2xl space-y-12 animate-scale-in">
          <div className="text-center">
            <h2 className="font-cormorant text-5xl md:text-6xl font-light mb-8 tracking-tight">
              Собрание волшебниц
            </h2>
            
            <div className="space-y-6 text-base md:text-lg font-montserrat font-light leading-relaxed">
              <p>Дорогая, загадочная, прекрасная!</p>
              
              <p>
                Пришло время ненадолго снять плащ повседневности и погрузиться в магию чисто женского круга. 
                Мой день рождения - это не просто дата в календаре. Это повод создать пространство, 
                где воздух будет дрожать от смеха, откровений и лёгкого безумия.
              </p>
              
              <p>
                Это будет вечер, где главные героини - только мы. Ты и другие удивительные девочки, 
                из чьих улыбок складывается моё счастье. Настройся на волну принятия, легкого флирта с жизнью, 
                душевных разговоров под хорошую музыку, танцев до головокружения и моментов, 
                которые захочется сохранить в памяти.
              </p>
              
              <p className="font-cormorant text-2xl italic mt-8">
                Твоя Алёна
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl w-full space-y-16">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <Card className="bg-black border-white/20 p-8 hover:border-white/40 transition-colors">
              <div className="flex items-start gap-4">
                <Icon name="Calendar" size={32} className="text-white/60" />
                <div>
                  <h3 className="font-montserrat text-xs uppercase tracking-widest text-white/60 mb-3">
                    Когда
                  </h3>
                  <p className="font-cormorant text-3xl font-light">21 февраля</p>
                  <p className="font-montserrat text-lg mt-2 text-white/80">
                    Сбор гостей в 18:00
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-black border-white/20 p-8 hover:border-white/40 transition-colors">
              <div className="flex items-start gap-4">
                <Icon name="MapPin" size={32} className="text-white/60" />
                <div>
                  <h3 className="font-montserrat text-xs uppercase tracking-widest text-white/60 mb-3">
                    Где
                  </h3>
                  <p className="font-cormorant text-3xl font-light">
                    Загородный очаг
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="bg-black border-white/20 p-8 hover:border-white/40 transition-colors">
            <div className="flex items-start gap-4">
              <Icon name="Sparkles" size={32} className="text-white/60" />
              <div className="flex-1">
                <h3 className="font-montserrat text-xs uppercase tracking-widest text-white/60 mb-3">
                  Дресс-код
                </h3>
                <p className="font-cormorant text-2xl md:text-3xl font-light leading-relaxed">
                  Облачитесь в белое — от призрачной феи до кинодивы
                </p>
              </div>
            </div>
          </Card>

          <div className="text-center space-y-6">
            <h3 className="font-montserrat text-xs uppercase tracking-widest text-white/60">
              До встречи осталось
            </h3>
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { label: 'дней', value: timeLeft.days },
                { label: 'часов', value: timeLeft.hours },
                { label: 'минут', value: timeLeft.minutes },
                { label: 'секунд', value: timeLeft.seconds }
              ].map((item) => (
                <div key={item.label} className="border border-white/20 p-6">
                  <div className="font-cormorant text-4xl md:text-5xl font-light">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="font-montserrat text-xs uppercase tracking-wider text-white/60 mt-2">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h3 className="font-cormorant text-4xl md:text-5xl font-light mb-4">
              Жду ответа
            </h3>
            <p className="font-montserrat text-sm text-white/60 tracking-wide">
              Подтверди своё присутствие
            </p>
          </div>

          {rsvp === null ? (
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => handleRSVP('yes')}
                className="h-14 bg-white text-black hover:bg-white/90 font-montserrat text-sm tracking-widest uppercase transition-all"
              >
                Буду
              </Button>
              <Button
                onClick={() => handleRSVP('no')}
                variant="outline"
                className="h-14 border-white/20 text-white hover:bg-white/10 font-montserrat text-sm tracking-widest uppercase transition-all"
              >
                Не буду
              </Button>
            </div>
          ) : (
            <Card className="bg-black border-white/20 p-8 animate-scale-in">
              <div className="flex items-center gap-3 justify-center mb-4">
                <Icon 
                  name={rsvp === 'yes' ? 'Check' : 'X'} 
                  size={24} 
                  className={rsvp === 'yes' ? 'text-white' : 'text-white/60'} 
                />
              </div>
              <p className="font-cormorant text-2xl font-light">
                {rsvp === 'yes' ? 'Прекрасно! До встречи!' : 'Жаль, что не увидимся'}
              </p>
              <Button
                onClick={() => setRsvp(null)}
                variant="ghost"
                className="mt-6 text-white/60 hover:text-white font-montserrat text-xs tracking-widest uppercase"
              >
                Изменить ответ
              </Button>
            </Card>
          )}
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <p className="text-center font-montserrat text-xs text-white/40 tracking-widest">
          С любовью, Алёна · 2026
        </p>
      </footer>
    </div>
  );
};

export default Index;

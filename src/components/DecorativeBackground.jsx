const stars = [
  { left: '4%', bottom: '6%', size: 8, delay: '0s', duration: '12s', drift: '24px' },
  { left: '12%', bottom: '18%', size: 7, delay: '1.4s', duration: '15s', drift: '-18px' },
  { left: '22%', bottom: '10%', size: 9, delay: '2.5s', duration: '13s', drift: '26px' },
  { left: '32%', bottom: '16%', size: 6, delay: '0.9s', duration: '16s', drift: '-20px' },
  { left: '42%', bottom: '8%', size: 10, delay: '2.1s', duration: '14s', drift: '18px' },
  { left: '52%', bottom: '20%', size: 7, delay: '3.2s', duration: '17s', drift: '-28px' },
  { left: '62%', bottom: '9%', size: 9, delay: '2.0s', duration: '13s', drift: '22px' },
  { left: '73%', bottom: '14%', size: 8, delay: '1.7s', duration: '16s', drift: '-24px' },
  { left: '82%', bottom: '7%', size: 10, delay: '2.8s', duration: '15s', drift: '18px' },
  { left: '90%', bottom: '18%', size: 7, delay: '4s', duration: '18s', drift: '-20px' },
  { left: '96%', bottom: '12%', size: 6, delay: '3.5s', duration: '13s', drift: '16px' },
]

const bubbles = [
  { left: '5%', bottom: '5%', size: 56, delay: '0s', duration: '18s', drift: '26px' },
  { left: '16%', bottom: '10%', size: 70, delay: '0.9s', duration: '22s', drift: '-22px' },
  { left: '29%', bottom: '7%', size: 78, delay: '2.1s', duration: '20s', drift: '24px' },
  { left: '42%', bottom: '11%', size: 68, delay: '1.6s', duration: '24s', drift: '-20px' },
  { left: '56%', bottom: '8%', size: 82, delay: '2.8s', duration: '21s', drift: '28px' },
  { left: '69%', bottom: '12%', size: 72, delay: '3.4s', duration: '23s', drift: '-18px' },
  { left: '81%', bottom: '6%', size: 62, delay: '1.2s', duration: '19s', drift: '22px' },
  { left: '92%', bottom: '10%', size: 78, delay: '3.7s', duration: '22s', drift: '-24px' },
]

export default function DecorativeBackground({ variant = 'default' }) {
  return (
    <div className={`decorative-bg decorative-bg--${variant}`} aria-hidden="true">
      {stars.map((star, index) => (
        <span
          key={`star-${index}`}
          className="decorative-star"
          style={{
            left: star.left,
            bottom: star.bottom,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
            '--star-drift': star.drift,
          }}
        />
      ))}

      {bubbles.map((bubble, index) => (
        <span
          key={`bubble-${index}`}
          className="decorative-bubble"
          style={{
            left: bubble.left,
            bottom: bubble.bottom,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDelay: bubble.delay,
            animationDuration: bubble.duration,
            '--bubble-drift': bubble.drift,
          }}
        />
      ))}
    </div>
  )
}

import { animated, useSpring } from 'react-spring'

function AnimatedNumber({ toValue, delay = 0 }) {
  const props = useSpring({
    number: toValue,
    from: { number: 0 },
    delay,
    // simulate a slot machine effect where the number spins to the final value and then settles on it
    config: {
      duration: 1500,
      curve: 'easeOut',
    },
  })

  return <animated.div>{props.number.to((n) => n.toFixed(0))}</animated.div>
}

export default AnimatedNumber

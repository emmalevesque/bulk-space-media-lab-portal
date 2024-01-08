import { Flex, Inline, Tooltip } from '@sanity/ui'
import { animated, useSpring } from 'react-spring'

function AnimatedNumber({ toValue, delay = 0, isCurrency = false }) {
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

  return (
    <Tooltip
      content={
        isCurrency
          ? `This value is calculated by adding up all of the "replacement cost" values in the inventory`
          : ''
      }
    >
      <Inline paddingY={2}>
        {isCurrency ? (
          <Flex>
            ~ $
            <animated.div>
              {props.number.to((n) =>
                n
                  .toFixed(isCurrency ? 2 : 0)
                  .slice(0, -3)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              )}
            </animated.div>
          </Flex>
        ) : (
          <animated.div>
            {props.number.to((n) => n.toFixed(isCurrency ? 2 : 0))}
          </animated.div>
        )}
      </Inline>
    </Tooltip>
  )
}

export default AnimatedNumber

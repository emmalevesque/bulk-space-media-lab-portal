export default (props) => {
  console.log({ props })

  return <>{props.renderDefault(props)}</>
}

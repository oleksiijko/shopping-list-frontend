import type { SVGProps } from 'react'

const iconProps = (props?: SVGProps<SVGSVGElement>) => ({
  fill: 'currentColor',
  'aria-hidden': true,
  ...props,
})

export function IconBack(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" {...iconProps(props)}>
      <path d="M3.828 6.778L16 6.778V8.778L3.828 8.778L9.192 14.142L7.778 15.556L0 7.778L7.778 0L9.192 1.414L3.828 6.778Z" />
    </svg>
  )
}

export function IconEdit(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...iconProps(props)}>
      <path d="M0 14.2525V18.0025H3.75L14.81 6.9425L11.06 3.1925L0 14.2525ZM17.71 4.0425C18.1 3.6525 18.1 3.0225 17.71 2.6325L15.37 0.2925C14.98 -0.0975 14.35 -0.0975 13.96 0.2925L12.13 2.1225L15.88 5.8725L17.71 4.0425Z" />
    </svg>
  )
}

export function IconTrash(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" xmlns="http://www.w3.org/2000/svg" {...iconProps(props)}>
      <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z" />
    </svg>
  )
}

export function IconPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg" {...iconProps(props)}>
      <path d="M4.50852 12.0682V0H7.55966V12.0682H4.50852ZM0 7.55966V4.50852H12.0682V7.55966H0Z" />
    </svg>
  )
}

export function IconCloseCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...iconProps(props)}>
      <path d="M12.59 6L10 8.59L7.41 6L6 7.41L8.59 10L6 12.59L7.41 14L10 11.41L12.59 14L14 12.59L11.41 10L14 7.41L12.59 6ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z" />
    </svg>
  )
}

export function IconSubmitArrow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="21" height="18" viewBox="0 0 21 18" xmlns="http://www.w3.org/2000/svg" {...iconProps(props)}>
      <path d="M0.00999999 18L21 9L0.00999999 0L0 7L15 9L0 11L0.00999999 18Z" />
    </svg>
  )
}

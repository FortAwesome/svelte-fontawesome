/// <reference types="svelte" />
import * as CSS from 'csstype';
import { SvelteComponentTyped } from 'svelte';
import {
  Transform,
  IconName,
  IconProp,
  FlipProp,
  SizeProp,
  PullProp,
  RotateProp,
  FaSymbol
} from '@fortawesome/fontawesome-svg-core'

export class FontAwesomeIcon extends SvelteComponentTyped<FontAwesomeIconProps> {}

// This is identical to the version of Omit in Typescript 3.5. It is included for compatibility with older versions of Typescript.
type BackwardCompatibleOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

type WithPrefix<T extends string> = `fa-${T} fa-${IconName}`

export interface FontAwesomeIconProps {
  icon: WithPrefix<'solid'> | WithPrefix<'regular'> | WithPrefix<'light'> | WithPrefix<'thin'> | WithPrefix<'duotone'> | WithPrefix<'brands'> | IconProp
  mask?: IconProp
  maskId?: string
  class?: string
  spin?: boolean
  spinPulse?: boolean
  spinReverse?: boolean
  pulse?: boolean
  beat?: boolean
  fade?: boolean
  beatFade?: boolean
  bounce?: boolean
  shake?: boolean
  border?: boolean
  fixedWidth?: boolean
  inverse?: boolean
  listItem?: boolean
  flip?: FlipProp
  size?: SizeProp
  pull?: PullProp
  rotation?: RotateProp
  transform?: string | Transform
  symbol?: FaSymbol
  style?: CSS.PropertiesHyphen | string
  tabIndex?: number;
  title?: string;
  titleId?: string;
  swapOpacity?: boolean;
}

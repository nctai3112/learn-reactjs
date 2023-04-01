import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import DesktopLayout from './DesktopLayout'
import MobileLayout from './MobileLayout'

const Layout = (props) => {
  const isMobileLayout = useMediaQuery('(max-width:800px)');
  const { children } = props

  if (isMobileLayout) {
    return <MobileLayout>
      {children}
    </MobileLayout>
  } else {
    return <DesktopLayout>
      {children}
    </DesktopLayout>
  }
}

export default Layout
import { Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

export function Layout() {
  return (
    <div className={styles.viewport}>
      <div className={styles.device}>
        <div className={styles.statusBar} aria-hidden="true">
          <div className={styles.notch} />
          <div className={styles.statusSignal} />
          <div className={styles.statusBattery} />
        </div>

        <div className={styles.content}>
          <Outlet />
        </div>

        <div className={styles.bottomBar} aria-hidden="true">
          <div className={styles.homeIndicator} />
        </div>
      </div>
    </div>
  )
}

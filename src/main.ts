import { mountDemoApp } from './demo/app'
import './styles.css'

const app = document.getElementById('app')
if (!app) {
  throw new Error('Element with id "app" not found')
}

mountDemoApp(app)

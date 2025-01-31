import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authRouter } from './routes/auth.routes';
import { activityRouter } from './routes/activity.routes';


const app = new Hono<{
  Bindings : {
    DATABASE_URL : string
    JWT_SECRET : string
  }
}>();

app.use('/*', cors({
  origin : '*'
}))

app.route('/auth', authRouter)
app.route('/api/activity', activityRouter)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app

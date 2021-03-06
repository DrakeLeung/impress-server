import Router from 'koa-router'

import { photoUpload } from '../../config/upload'
import photoModel from './photoModel'

const router = new Router()

router
  .post('/', photoUpload.single('photo'), ctx => {
    const { originalname, path } = ctx.req.file
    const photo = {
      name: originalname,
      url: path.replace(/\\/gi, '/').replace('public', ''),
      upload_user_id: ctx.session.user.id,
    }

    return photoModel.addPhoto(photo)
      .then(() => {
        ctx.body = {
          success: true,
          data: photo,
        }
      })
  })

  .get('/', ctx =>
    photoModel.getPhotos(ctx.session.user.id)
      .then(result => {
        ctx.body = {
          success: true,
          data: result,
        }
      })
  )

  .delete('/:id', ctx =>
    photoModel.deletePhoto(ctx.params.id)
      .then(result => {
        ctx.body = { success: !!result }
      })
  )

  .put('/:id', ctx => {
    const { id } = ctx.params
    const { name, description } = ctx.request.body

    return photoModel.updatePhoto({ id, name, description })
      .then(result => {
        ctx.body = {
          success: !!result,
        }
      })
  })

export default router

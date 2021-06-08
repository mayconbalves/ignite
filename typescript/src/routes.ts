import { Request, Response } from 'express'
import CreateCouseService from './CreateCourseService'


export function createCouser(request: Request, response: Response) {
  
  CreateCouseService.execute({
    name: 'NodeJS',
    educator: 'Maycon',
    duration: 10
  })

  return response.send()
}
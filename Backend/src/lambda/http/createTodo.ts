import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createTodoItem, getByName } from '../../services/todos'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
const logger = createLogger('todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  const userId = getUserId(event)
  const requestBody: CreateTodoRequest = JSON.parse(event.body)

  //handler check name unique 

  const item_check = await getByName(userId, requestBody.name)
  console.log(`----------item check ---------- ${item_check}`)
  logger.info(`handler value item check get bu name api create todo ${item_check}`)
  if (item_check.length>0) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: `name already exists`
      })
    }
  }



  const item = await createTodoItem(requestBody, userId)
  delete item['userId']




  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item
    })
  }
}

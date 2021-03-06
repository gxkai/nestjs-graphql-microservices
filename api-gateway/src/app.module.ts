import { join } from 'path'

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql'
import { DateTimeResolver, EmailAddressResolver, UnsignedIntResolver } from 'graphql-scalars'
import { GraphQLJSONObject } from 'graphql-type-json'

import { AuthModule } from './auth/auth.module'
import { CommentsModule } from './comments/comments.module'
import { PostsModule } from './posts/posts.module'
import { UsersModule } from './users/users.module'

import { playgroundQuery } from './graphql/playground-query'
import { Logger } from './utils/log4js'
import { formatError } from 'graphql'
import { GraphQLError } from 'graphql/error/GraphQLError'
import {GraphQLRequestContext, GraphQLResponse} from "apollo-server-types";

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync({
      imports: [],
      useFactory: async (): Promise<GqlModuleOptions> => ({
        path: '/',
        subscriptions: '/',
        typePaths: ['./**/*.graphql'],
        resolvers: {
          DateTime: DateTimeResolver,
          EmailAddress: EmailAddressResolver,
          UnsignedInt: UnsignedIntResolver,
          JSONObject: GraphQLJSONObject
        },
        definitions: {
          path: join(__dirname, 'graphql.ts')
        },
        logger: Logger,
        // todo 错误日志
        formatError: (error: GraphQLError) => {
          return error
        },
        // todo 请求日志
        formatResponse: (response: GraphQLResponse | null, requestContext: GraphQLRequestContext<Record<string, any>>) => {
          return response
        },
        debug: true,
        cors: false,
        installSubscriptionHandlers: true,
        playground: {
          endpoint: '/',
          subscriptionEndpoint: '/',
          settings: {
            'request.credentials': 'include'
          },
          tabs: [
            {
              name: 'GraphQL API',
              endpoint: '/',
              query: playgroundQuery
            }
          ]
        },
        context: ({ req, res }): any => ({ req, res })
      }),
      inject: []
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule
  ]
})
export class AppModule {}

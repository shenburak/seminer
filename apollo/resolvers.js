/* eslint-disable no-unused-vars */

import { AuthenticationError, UserInputError } from 'apollo-server-micro'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'

import mongoose from './database'
import kittenModel from './Models/kitten'
import sinifModel from './Models/sinif'
import kisiModel from './Models/kisi'

const JWT_SECRET = process.env.JWT_SECRET

const users = [{
    id: 'ae59d100-99df-46d0-b84d-4d4b83bc5457',
    email: 'keal67@keal67.com',
    hashedPassword: '$2a$10$uJvCZG4SWItoVq7pvrudie2M3618AgDiOsUb6F8Thy//G/M0czC6u'
}]

function createUser(data) {
    const salt = bcrypt.genSaltSync()

    return {
        id: v4(),
        email: data.email,
        hashedPassword: bcrypt.hashSync(data.password, salt),
    }
}

function validPassword(user, password) {
    return bcrypt.compareSync(password, user.hashedPassword)
}

export const resolvers = {
    Query: {
        async viewer(_parent, _args, context, _info) {
            const { token } = cookie.parse(context.req.headers.cookie || '')
            if (token) {
                try {
                    const { id, email } = jwt.verify(token, JWT_SECRET)

                    return users.find(user => user.id === id && user.email === email)
                } catch (a) {
                    throw new AuthenticationError(
                        'Authentication token is invalid, please log in'
                    )
                }
            }
        },
        async siniflar(_parent, _args, context, _info) {
            const siniflar = await sinifModel.find({})
            return siniflar
        },
        async kayitOlanlar(_parent, _args, context, _info) {
            const kisiler = await kisiModel.find({})
            const siniflar = await sinifModel.find({})
            var sinifKisiSayilari = {}
            await Promise.all(siniflar.map(async sinif => {
                const kisiSayisi = await kisiModel.count({ sinif: sinif.sinif })
                sinifKisiSayilari[sinif.sinif] = kisiSayisi
            }))
            var siniflar2 = []
            Object.keys(sinifKisiSayilari).map(sinif => {
                siniflar2.push({ sinif: sinif, kisiSayisi: sinifKisiSayilari[sinif] })
            })
            console.log(siniflar2)
            return { kisiler, siniflar: siniflar2 }
        },
    },
    Mutation: {
        async sinifKaydet(_parent, args, _context, _info) {
            const sinif = await sinifModel.findOne({ sinif: args.input.sinif })
            if (!sinif) {
                new sinifModel({ sinif: args.input.sinif, saat: args.input.saat, icerik: args.input.icerik, kontenjan: args.input.kontenjan, aciklama: args.input.aciklama }).save()
            } else {
                await sinifModel.updateOne({ sinif: args.input.sinif }, { sinif: args.input.sinif, saat: args.input.saat, icerik: args.input.icerik, kontenjan: args.input.kontenjan, aciklama: args.input.aciklama });
            }
            return { success: "true" }
        },
        async kisiKaydet(_parent, args, _context, _info) {
            new kisiModel({ kendisinifi: args.input.kendisinifi, isimsoyisim: args.input.isimsoyisim, numara: args.input.numara, sinif: args.input.sinif }).save()
            return { success: "true" }
        },

        async signUp(_parent, args, _context, _info) {
            const user = createUser(args.input)

            users.push(user)

            return { user }
        },

        async signIn(_parent, args, context, _info) {
            const user = users.find(user => user.email === args.input.email)

            if (user && validPassword(user, args.input.password)) {
                const token = jwt.sign(
                    { email: user.email, id: user.id, time: new Date() },
                    JWT_SECRET,
                    {
                        expiresIn: '6h',
                    }
                )

                context.res.setHeader(
                    'Set-Cookie',
                    cookie.serialize('token', token, {
                        httpOnly: true,
                        maxAge: 6 * 60 * 60,
                        path: '/',
                        sameSite: 'lax',
                        secure: process.env.NODE_ENV === 'production',
                    })
                )

                return { user }
            }

            throw new UserInputError('Invalid email and password combination')
        },
        async signOut(_parent, _args, context, _info) {
            context.res.setHeader(
                'Set-Cookie',
                cookie.serialize('token', '', {
                    httpOnly: true,
                    maxAge: -1,
                    path: '/',
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                })
            )

            return true
        },
    },
}
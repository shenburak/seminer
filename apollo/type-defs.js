import gql from 'graphql-tag'

export const typeDefs = gql`
type KisilerPayload {
  isimsoyisim: String!
  sinif: String!
  numara:String!
}
type SiniflarPayload {
  kisiSayisi: String!
  sinif: String!
}
type KayitOlan {
  siniflar:[SiniflarPayload]
  kisiler: [KisilerPayload]
}
type Sinif {
  saat: String
  sinif: String
  icerik: String
  kontenjan: String
  aciklama: String
}
  type User {
    id: ID!
    email: String!
  }
  input KayitOlanlarInput {
    sinif: String!
  }
  input KisiKaydetInput {
    kendisinifi: String!
    sinif: String!
    numara: String!
    isimsoyisim: String!
  }
  input SinifKaydetInput {
    saat: String!
    sinif: String!
    icerik: String!
    kontenjan: String!
    aciklama: String!
  }
  input SignUpInput {
    email: String!
    password: String!
  }
  input SignInInput {
    email: String!
    password: String!
  }
  type KisiKaydetPayload {
    success: String!
  }
  type SinifKaydetPayload {
    success: String!
  }
  type SignUpPayload {
    user: User!
  }
  type SignInPayload {
    user: User!
  }
  type Query {
    user(id: ID!): User!
    users: [User]!
    siniflar: [Sinif]!
    kayitOlanlar(input: KayitOlanlarInput!): KayitOlan!
    viewer: User
  }
  type Mutation {
    kisiKaydet(input: KisiKaydetInput!): KisiKaydetPayload!
    sinifKaydet(input: SinifKaydetInput!): SinifKaydetPayload!
    signUp(input: SignUpInput!): SignUpPayload!
    signIn(input: SignInInput!): SignInPayload!
    signOut: Boolean!
  }
`
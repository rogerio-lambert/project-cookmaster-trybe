const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const getConnectionMock = require('./conectionMock');
const { MongoClient } = require('mongodb');

const server = require('../api/app');



chai.use(chaiHttp);

const { expect } = chai;

describe('Verificação de rota de criação de usuário,', () => {
    describe('Quando usuário é criado com sucesso', () => {
        let response = {};
        let connectionMock;
        before(async () => {
            connectionMock = await getConnectionMock();

            sinon.stub(MongoClient, 'connect')
                .resolves(connectionMock);
            
            response = await chai.request(server)
                .post('/users')
                .send({
                    name: 'Jane',
                    email: 'jane@gmail.com',
                    password: 'senha123'
                });
        });

        after(async () => {
            MongoClient.connect.restore();
        })

        it('retorna status 201', () => {
            expect(response).to.have.status(201);
        });

        it('Retorna um objeto', () => {
            expect(response.body).to.be.a('object');
        });

        it('o objeto possui a propriedade "user" corretamente', () => {
            expect(response.body)
              .to.have.property('user');
            expect(response.body.user).to.have.property('name');
            expect(response.body.user.name).to.be.equal('Jane');
            expect(response.body.user.email).to.be.equal('jane@gmail.com');
            expect(response.body.user).to.not.have.property('senha');
        });
    });

    describe('Verifica que não é possível criar um usuário faltando a propriedade "name"', () => {
        let response = {};
        let connectionMock;
        before(async () => {
            connectionMock = await getConnectionMock();

            sinon.stub(MongoClient, 'connect')
                .resolves(connectionMock);
            
            response = await chai.request(server)
                .post('/users')
                .send({
                    email: 'jane@gmail.com',
                    password: 'senha123'
                });
        });

        after(async () => {
            MongoClient.connect.restore();
        })

        it('retorna status 400', () => {
            expect(response).to.have.status(400);
        });

        it('Retorna um objeto', () => {
            expect(response.body).to.be.a('object');
        });

        it('o objeto possui a propriedade "message" corretamente', () => {
            expect(response.body)
              .to.have.property('message');
            expect(response.body.message).to.equal('Invalid entries. Try again.');
        });
    });
    describe('Verifica que não é possível criar um usuário faltando a propriedade "email"', () => {
        let response = {};
        let connectionMock;
        before(async () => {
            connectionMock = await getConnectionMock();

            sinon.stub(MongoClient, 'connect')
                .resolves(connectionMock);
            
            response = await chai.request(server)
                .post('/users')
                .send({
                    name: 'Jane',
                    password: 'senha123'
                });
        });

        after(async () => {
            MongoClient.connect.restore();
        })

        it('retorna status 400', () => {
            expect(response).to.have.status(400);
        });

        it('Retorna um objeto', () => {
            expect(response.body).to.be.a('object');
        });

        it('o objeto possui a propriedade "message" corretamente', () => {
            expect(response.body)
              .to.have.property('message');
            expect(response.body.message).to.equal('Invalid entries. Try again.');
        });
    });
    describe('Verifica que não é possível criar um usuário faltando a propriedade "password"', () => {
        let response = {};
        let connectionMock;
        before(async () => {
            connectionMock = await getConnectionMock();

            sinon.stub(MongoClient, 'connect')
                .resolves(connectionMock);
            
            response = await chai.request(server)
                .post('/users')
                .send({
                    name: 'Jane',
                    email: 'jane@gmail.com',
                });
        });

        after(async () => {
            MongoClient.connect.restore();
        })

        it('retorna status 400', () => {
            expect(response).to.have.status(400);
        });

        it('Retorna um objeto', () => {
            expect(response.body).to.be.a('object');
        });

        it('o objeto possui a propriedade "message" corretamente', () => {
            expect(response.body)
              .to.have.property('message');
            expect(response.body.message).to.equal('Invalid entries. Try again.');
        });
    });
    describe('Verifica que não é possível criar um usuário a propriedade "email" inválida', () => {
        let response = {};
        let connectionMock;
        before(async () => {
            connectionMock = await getConnectionMock();

            sinon.stub(MongoClient, 'connect')
                .resolves(connectionMock);
            
            response = await chai.request(server)
                .post('/users')
                .send({
                    name: 'Jane',
                    email: 'jane@',
                    password: 'senha123'
                });
        });

        after(async () => {
            MongoClient.connect.restore();
        })

        it('retorna status 400', () => {
            expect(response).to.have.status(400);
        });

        it('Retorna um objeto', () => {
            expect(response.body).to.be.a('object');
        });

        it('o objeto possui a propriedade "message" corretamente', () => {
            expect(response.body)
              .to.have.property('message');
            expect(response.body.message).to.equal('Invalid entries. Try again.');
        });
    });
    describe('Verifica que não é possível criar um usuário com email que já esteja registrado no banco', () => {
        let response = {};
        let connectionMock;
        before(async () => {
            connectionMock = await getConnectionMock();

            sinon.stub(MongoClient, 'connect')
                .resolves(connectionMock);

            await connectionMock.db('Cookmaster').collection('users')
              .insertOne({ name: 'Jane', email: 'jane@gmail.com', password: 'senha123', role: 'user' })

            response = await chai.request(server)
                .post('/users')
                .send({
                    name: 'Jane',
                    email: 'jane@gmail.com',
                    password: 'senha123'
                });
        });

        after(async () => {
            MongoClient.connect.restore();
        })

        it('retorna status 409', () => {
            expect(response).to.have.status(409);
        });

        it('Retorna um objeto', () => {
            expect(response.body).to.be.a('object');
        });

        it('o objeto possui a propriedade "message" corretamente', () => {
            expect(response.body)
              .to.have.property('message');
            expect(response.body.message).to.equal('Email already registered');
        });
    });
});

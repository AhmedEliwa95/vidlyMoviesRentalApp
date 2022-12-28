const request = require('supertest');
const { Genre } = require('../../models/genre');
const {User} = require('../../models/user');
let server ;

describe('auth MiddleWare',()=>{
    beforeEach(()=>{server = require('../../index')})
    afterEach(async()=>{
        await server.close();
        await Genre.remove({});
    });

    let token ;
    const exec = ()=>{
        return request(server)
            .post('/api/genres')
            .set('x-auth-token',token)
            .send({name:'genre1'})
    };
    beforeEach(()=>{token  = new User().generateAuthToken()})
    it('should return 401 if no token ',async()=>{
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if invalid token ',async()=>{
        token = '1';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return valid token ',async()=>{
        const res = await exec();
        expect(res.status).toBe(200)
    });

})
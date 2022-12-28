const { default: mongoose } = require('mongoose');
const moment = require('moment')
const request = require('supertest');
const {Movie} = require('../../models/movie')
const {Rental} = require('../../models/rental');
const { User } = require('../../models/user');

describe('/api/returns',()=>{
    let server , customerId , movieId , rental,  token , movie;
    const exec =  ()=>{
        return request(server)
            .post('/api/returns')
            .set('x-auth-token',token)
            .send({customerId,movieId})
    };
    beforeEach(async()=>{
        customerId =mongoose.Types.ObjectId(); 

        movieId =mongoose.Types.ObjectId(); 

        token = new User().generateAuthToken()

        server = require('../../index')

        movie = new Movie({
            _id:movieId,
            title:'12345',
            genre:{name : '12345'},
            dailyRentalRate:2,
            numberInStock:10
        });
        await movie.save();

        rental = new Rental({
            customer:{
                _id:customerId,
                name:'12345',
                phone:'12345'
            },
            movie:{
                _id:movieId,
                title:'12345',
                dailyRentalRate:2
            }
        });
        await rental.save()

    });
    
    afterEach(async()=>{
        await server.close();
        await Rental.deleteMany({});
        await Movie.deleteMany({});     
    });

    it('should work !', async()=>{
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    });

    it('sholud return 401 if client is not logged in ',async()=>{
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId not provided',async()=>{
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
        
    });

    it('should return 400 if movieId not provided',async()=>{
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
        
    });

    it('should return 404 if no rental found for customer/movie compination',async()=>{
        await Rental.deleteMany({});
        const res = await exec();
        expect(res.status).toBe(404);
        
    });

    it('should return 400 rental if  have been processed ',async()=>{
        rental.dateReturned= new Date();
        await rental.save()
        const res = await exec();
        expect(res.status).toBe(400);
        
    });

    it('should return 200 if we have a valid request ',async()=>{

        const res = await exec();
        expect(res.status).toBe(200);
        
    });

    it('should pass the returned date  ',async()=>{
        const res = await exec();
        const rentalInDB = await Rental.findById(rental._id);
        rentalInDB.dateReturned = Date();
        const difr =new Date() -  rentalInDB.dateReturned ;
        // await rental.save()
        expect(difr).toBeLessThan(10*1000);
        
    });

    it('should set rentalFee if input is valid   ',async()=>{
       
        rental.dateOut = moment().add(-7,'days').toDate();
        await rental.save()
        const res = await exec();
        const rentalInDB = await Rental.findById(rental._id);
        expect(rentalInDB.rentalFee).toBe(14);
        
    });

    it('should increse the stock of the movie ',async()=>{
        
        const res = await exec();
        const movieInDB = await Movie.findById(movieId);
        expect(movieInDB.numberInStock).toBe(movie.numberInStock+1);
        
    });

    it('should return the rental object in the body of the response  ',async()=>{
        
        const res = await exec();
        const rentalInDB = await Rental.findById(rental._id)
        expect(res.body).toHaveProperty('dateOut');
        expect(res.body).toHaveProperty('rentalFee');
        expect(res.body).toHaveProperty('dateReturned');
        // expect(rentalInDB).toHaveProperty('rental.customer._id',customerId);
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut','dateReturned','rentalFee' , 'customer' , 'movie'])
        )
    });

})
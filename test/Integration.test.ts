import request from 'supertest';
import app from '../src/app';

describe("Test Endpoints", () => {
    test("test /key endpoint success", async () => {
        const response = await request(app)
            .get("/key")
            
        expect(response.status).toEqual(200);
        expect(response.body.session_key).toBeDefined();
    })

    test("test /guess endpoint success", async () => {
        const getKeyResposne = await request(app)
            .get("/key");
        const key = getKeyResposne.body.session_key!;

        const response = await request(app)
            .post("/guess")
            .send({
                session_key: key,
                guess: "12345"
            });
        
        expect(response.status).toEqual(200);
        expect(response.body.result).toStrictEqual(['n','n','n','n','n'])
    });

    test("test /guess endpoint bad size fail", async () => {
        const getKeyResposne = await request(app)
            .get("/key");
        const key = getKeyResposne.body.session_key!;

        const response = await request(app)
            .post("/guess")
            .send({
                session_key: key,
                guess: "123456"
            });
        
        expect(response.status).toEqual(400);
    });

    test("test /guess endpoint no body fail", async () => {

        const response = await request(app)
            .post("/guess");
        
        expect(response.status).toEqual(400);
    });

    test("test /guess endpoint session not exist, fail", async () => {
        const response = await request(app)
            .post("/guess")
            .send({
                session_key: "bad session",
                guess: "12345"
            });
        
        expect(response.status).toEqual(400);
    });

    test("test /history endpoint success", async () => {
        const getKeyResposne = await request(app)
            .get("/key");
        const key = getKeyResposne.body.session_key!;

        await request(app)
            .post("/guess")
            .send({
                session_key: key,
                guess: "12345"
            });

        await request(app)
            .post("/guess")
            .send({
                session_key: key,
                guess: "45678"
            });
        
        const response = await request(app)
            .post("/history")
            .send({session_key: key});

        const resposneObject = response.body;
        const entries = resposneObject.entries;

        expect(response.status).toBe(200);
        expect(resposneObject.session_key).toBe(key);
        expect(entries.length).toBe(2);
        expect(entries[0].guess).toBe("12345");
        expect(entries[0].result).toStrictEqual(['n','n','n','n','n']);
        expect(entries[1].guess).toBe("45678");
        expect(entries[1].result).toStrictEqual(['n','n','n','n','n']);
    });

    test("test /history endpoint not key defined, fail", async () => {
        const response = await request(app)
            .post("/history");

        expect(response.status).toBe(400);
    });

    test("test /history endpoint bad key, fail", async () => {
        
        const response = await request(app)
            .post("/history")
            .send({session_key: "bad session"});

        expect(response.status).toBe(400);
    });
});
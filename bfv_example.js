const BFVParameters = require('./bfv_parameters.js');
const BFVKeyGenerator = require('./bfv_key_generator.js');
const IntegerEncoder = require('./bfv_int_encoder.js');
const BFVEncryptor = require('./bfv_encryptor.js');
const BFVDecryptor = require('./bfv_decryptor.js');
const BFVEvaluator = require('./bfv_evaluator.js');

let degree = 256;
let plain_modulus = 17;
// let plain_modulus = 64951;
// let cipher_modulus = 8000000000000000000000;
let cipher_modulus = 8000000000000;

const params = new BFVParameters(degree, plain_modulus, cipher_modulus);
const key_generator = new BFVKeyGenerator(params);

// key_generator.print_keys();

const secret_key = key_generator.secret_key;
const public_key = key_generator.public_key;
const relin_key = key_generator.relin_key;

const encoder = new IntegerEncoder(params);
const encryptor = new BFVEncryptor(params, public_key);
const decryptor = new BFVDecryptor(params, secret_key);
const evaluator = new BFVEvaluator(params);
let count = 0;
for (let i=0;i<10;i++){
      // const evaluator = BFVEvaluator(params)

      // let message1 = 2;
      // let message2 = 2;
      // let message3 = 2;
      let message1 = Math.floor(Math.random() * 1000);
      console.log("Number 1: ", message1);
      let message2 = Math.floor(Math.random() * 1000);
      console.log("Number 2: ", message2);
      let message3 = Math.floor(Math.random() * 1000);
      console.log("Number 3: ", message3);

      let encoded_plain1 = encoder.encode(message1);
      let encoded_plain2 = encoder.encode(message2);
      let encoded_plain3 = encoder.encode(message3);
      let cipher1 = encryptor.encrypt(encoded_plain1);
      let cipher2 = encryptor.encrypt(encoded_plain2);
      let cipher3 = encryptor.encrypt(encoded_plain3);
      // console.log("Encrypted number: ", cipher1);
      let mul = evaluator.multiply(cipher1, cipher2, relin_key);
      let final = evaluator.add(mul, cipher3);
      // for(let i=0;i<1;i++)
      //       add = evaluator.add(add,cipher1);
      let decrypted_encoded = decryptor.decrypt(final);
      // console.log("Decrypted encoded: ", decrypted_encoded);
      let decrypted = encoder.decode(decrypted_encoded);
      console.log("Decrypted: ", decrypted);
      if((message1 * message2) + message3 == decrypted)
            count ++;
}

console.log("Count: ", count);

var plain_modulus = 8;
var cipher_modulus = 17179869184; // This is 2^34
// var degrees = [16, 32, 64, 128, 256, 512, 1024];
var degrees = [16, 32, 64, 128];
var test_cases = 10;

function use_case_1(){
      for (let degree=0; degree<degrees.length; degree++) {
            var avg_key_gen_time = 0;
            var avg_enc_time = 0;
            var avg_operation_time = 0;
            var avg_dec_time = 0;
            var avg_total_time = 0;
            var working_case = 0;

            for(let i=0; i<test_cases; i++){
                  let test_case = "x + y";
                  var startTime = performance.now();
                  const params = new BFVParameters(degrees[degree], plain_modulus, cipher_modulus);
                  const key_generator = new BFVKeyGenerator(params);
                        
                  const secret_key = key_generator.secret_key;
                  const public_key = key_generator.public_key;
                  const relin_key = key_generator.relin_key;
                  var key_gen_time = (performance.now() - startTime);
                  avg_key_gen_time += key_gen_time;
                  
                  let message1 = Math.floor(Math.random() * 10);
                  let message2 = Math.floor(Math.random() * 10);

                  const encoder = new IntegerEncoder(params);
                  const encryptor = new BFVEncryptor(params, public_key);

                  let encoded_plain1 = encoder.encode(message1);
                  let encoded_plain2 = encoder.encode(message2);

                  let cipher1 = encryptor.encrypt(encoded_plain1);
                  let cipher2 = encryptor.encrypt(encoded_plain2);
                  var encryption_time = ((performance.now() - startTime)) - key_gen_time;
                  avg_enc_time += encryption_time;

                  const evaluator = new BFVEvaluator(params);
                  // x + y
                  let final = evaluator.add(cipher1, cipher2);
                  var operation_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time);
                  avg_operation_time += operation_time;

                  const decryptor = new BFVDecryptor(params, secret_key);
                  let decrypted_encoded = decryptor.decrypt(final);
                  let decrypted = encoder.decode(decrypted_encoded);
                  var decryption_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time + operation_time);
                  avg_dec_time += decryption_time;

                  // x+y
                  if (message1 + message2 == decrypted)
                        working_case += 1;

                  var total_time = (performance.now() - startTime);    
                  avg_total_time += total_time;        
            }

            document.getElementById("plain_modulus_" + degrees[degree].toString()).innerHTML = plain_modulus;
            document.getElementById("cipher_modulus_" + degrees[degree].toString()).innerHTML = cipher_modulus;
            document.getElementById("key_gen_time_" + degrees[degree].toString()).innerHTML = ((avg_key_gen_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("encryption_time_" + degrees[degree].toString()).innerHTML = ((avg_enc_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("operation_time_" + degrees[degree].toString()).innerHTML = ((avg_operation_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("decryption_time_" + degrees[degree].toString()).innerHTML = ((avg_dec_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("total_time_" + degrees[degree].toString()).innerHTML = ((avg_total_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("test_case_" + degrees[degree].toString()).innerHTML = working_case + "/" + test_cases;
            console.log("Testing done for degree: ", degrees[degree]);
            localStorage.clear()
      }
}

function use_case_2(){
      for (let degree=0; degree<degrees.length; degree++) {
            var avg_key_gen_time = 0;
            var avg_enc_time = 0;
            var avg_operation_time = 0;
            var avg_dec_time = 0;
            var avg_total_time = 0;
            var working_case = 0;

            for(let i=0; i<test_cases; i++){
                  let test_case = "x * y";
                  var startTime = performance.now();
                  const params = new BFVParameters(degrees[degree], plain_modulus, cipher_modulus);
                  const key_generator = new BFVKeyGenerator(params);
                        
                  const secret_key = key_generator.secret_key;
                  const public_key = key_generator.public_key;
                  const relin_key = key_generator.relin_key;
                  var key_gen_time = (performance.now() - startTime);
                  avg_key_gen_time += key_gen_time;
                  
                  let message1 = Math.floor(Math.random() * 10);
                  let message2 = Math.floor(Math.random() * 10);

                  const encoder = new IntegerEncoder(params);
                  const encryptor = new BFVEncryptor(params, public_key);

                  let encoded_plain1 = encoder.encode(message1);
                  let encoded_plain2 = encoder.encode(message2);

                  let cipher1 = encryptor.encrypt(encoded_plain1);
                  let cipher2 = encryptor.encrypt(encoded_plain2);
                  var encryption_time = ((performance.now() - startTime)) - key_gen_time;
                  avg_enc_time += encryption_time;

                  const evaluator = new BFVEvaluator(params);
                  // x * y
                  let final = evaluator.multiply(cipher1, cipher2, relin_key);
                  var operation_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time);
                  avg_operation_time += operation_time;

                  const decryptor = new BFVDecryptor(params, secret_key);
                  let decrypted_encoded = decryptor.decrypt(final);
                  let decrypted = encoder.decode(decrypted_encoded);
                  var decryption_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time + operation_time);
                  avg_dec_time += decryption_time;

                  // x * y
                  if (message1 * message2 == decrypted)
                        working_case += 1;

                  var total_time = (performance.now() - startTime);    
                  avg_total_time += total_time;        
            }

            document.getElementById("plain_modulus_" + degrees[degree].toString()).innerHTML = plain_modulus;
            document.getElementById("cipher_modulus_" + degrees[degree].toString()).innerHTML = cipher_modulus;
            document.getElementById("key_gen_time_" + degrees[degree].toString()).innerHTML = ((avg_key_gen_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("encryption_time_" + degrees[degree].toString()).innerHTML = ((avg_enc_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("operation_time_" + degrees[degree].toString()).innerHTML = ((avg_operation_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("decryption_time_" + degrees[degree].toString()).innerHTML = ((avg_dec_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("total_time_" + degrees[degree].toString()).innerHTML = ((avg_total_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("test_case_" + degrees[degree].toString()).innerHTML = working_case + "/" + test_cases;
            console.log("Testing done for degree: ", degrees[degree]);
            localStorage.clear()
      }
}

function use_case_3(){
      for (let degree=0; degree<degrees.length; degree++) {
            var avg_key_gen_time = 0;
            var avg_enc_time = 0;
            var avg_operation_time = 0;
            var avg_dec_time = 0;
            var avg_total_time = 0;
            var working_case = 0;

            for(let i=0; i<test_cases; i++){
                  let test_case = "x * y * z";
                  var startTime = performance.now();
                  const params = new BFVParameters(degrees[degree], plain_modulus, cipher_modulus);
                  const key_generator = new BFVKeyGenerator(params);
                        
                  const secret_key = key_generator.secret_key;
                  const public_key = key_generator.public_key;
                  const relin_key = key_generator.relin_key;
                  var key_gen_time = (performance.now() - startTime);
                  avg_key_gen_time += key_gen_time;
                  
                  let message1 = Math.floor(Math.random() * 10);
                  let message2 = Math.floor(Math.random() * 10);
                  let message3 = Math.floor(Math.random() * 10);

                  const encoder = new IntegerEncoder(params);
                  const encryptor = new BFVEncryptor(params, public_key);

                  let encoded_plain1 = encoder.encode(message1);
                  let encoded_plain2 = encoder.encode(message2);
                  let encoded_plain3 = encoder.encode(message3);

                  let cipher1 = encryptor.encrypt(encoded_plain1);
                  let cipher2 = encryptor.encrypt(encoded_plain2);
                  let cipher3 = encryptor.encrypt(encoded_plain3);
                  var encryption_time = ((performance.now() - startTime)) - key_gen_time;
                  avg_enc_time += encryption_time;

                  const evaluator = new BFVEvaluator(params);
                  // x * y * z
                  let final = evaluator.multiply(cipher1, cipher2, relin_key);
                  final = evaluator.multiply(final, cipher3, relin_key);
                  var operation_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time);
                  avg_operation_time += operation_time;

                  const decryptor = new BFVDecryptor(params, secret_key);
                  let decrypted_encoded = decryptor.decrypt(final);
                  let decrypted = encoder.decode(decrypted_encoded);
                  var decryption_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time + operation_time);
                  avg_dec_time += decryption_time;

                  // x * y *z
                  if (message1 * message2 * message3 == decrypted)
                        working_case += 1;

                  var total_time = (performance.now() - startTime);    
                  avg_total_time += total_time;        
            }

            document.getElementById("plain_modulus_" + degrees[degree].toString()).innerHTML = plain_modulus;
            document.getElementById("cipher_modulus_" + degrees[degree].toString()).innerHTML = cipher_modulus;
            document.getElementById("key_gen_time_" + degrees[degree].toString()).innerHTML = ((avg_key_gen_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("encryption_time_" + degrees[degree].toString()).innerHTML = ((avg_enc_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("operation_time_" + degrees[degree].toString()).innerHTML = ((avg_operation_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("decryption_time_" + degrees[degree].toString()).innerHTML = ((avg_dec_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("total_time_" + degrees[degree].toString()).innerHTML = ((avg_total_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("test_case_" + degrees[degree].toString()).innerHTML = working_case + "/" + test_cases;
            console.log("Testing done for degree: ", degrees[degree]);
            localStorage.clear()
      }
}

function use_case_4(){
      for (let degree=0; degree<degrees.length; degree++) {
            var avg_key_gen_time = 0;
            var avg_enc_time = 0;
            var avg_operation_time = 0;
            var avg_dec_time = 0;
            var avg_total_time = 0;
            var working_case = 0;

            for(let i=0; i<test_cases; i++){
                  let test_case = "p * (1 + (r * t))";
                  var startTime = performance.now();
                  const params = new BFVParameters(degrees[degree], plain_modulus, cipher_modulus);
                  const key_generator = new BFVKeyGenerator(params);
                        
                  const secret_key = key_generator.secret_key;
                  const public_key = key_generator.public_key;
                  const relin_key = key_generator.relin_key;
                  var key_gen_time = (performance.now() - startTime);
                  avg_key_gen_time += key_gen_time;
                  
                  let message1 = Math.floor(Math.random() * 10);
                  let message2 = Math.floor(Math.random() * 10);
                  let message3 = Math.floor(Math.random() * 10);
                  let message_one = 1;

                  const encoder = new IntegerEncoder(params);
                  const encryptor = new BFVEncryptor(params, public_key);

                  let encoded_plain1 = encoder.encode(message1);
                  let encoded_plain2 = encoder.encode(message2);
                  let encoded_plain3 = encoder.encode(message3);
                  let encoded_one = encoder.encode(message_one);

                  let cipher1 = encryptor.encrypt(encoded_plain1);
                  let cipher2 = encryptor.encrypt(encoded_plain2);
                  let cipher3 = encryptor.encrypt(encoded_plain3);
                  let cipher_one = encryptor.encrypt(encoded_one);
                  var encryption_time = ((performance.now() - startTime)) - key_gen_time;
                  avg_enc_time += encryption_time;

                  const evaluator = new BFVEvaluator(params);
                  // p * (1 + (r * t))
                  let rt = evaluator.multiply(cipher2, cipher3, relin_key);
                  let sum = evaluator.add(cipher_one, rt);
                  let final = evaluator.multiply(cipher1, sum, relin_key);
                  var operation_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time);
                  avg_operation_time += operation_time;

                  const decryptor = new BFVDecryptor(params, secret_key);
                  let decrypted_encoded = decryptor.decrypt(final);
                  let decrypted = encoder.decode(decrypted_encoded);
                  var decryption_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time + operation_time);
                  avg_dec_time += decryption_time;

                  // p * (1 + (r * t))
                  if (message1 * (message_one + (message2 * message3)) == decrypted)
                        working_case += 1;

                  var total_time = (performance.now() - startTime);    
                  avg_total_time += total_time;        
            }

            document.getElementById("plain_modulus_" + degrees[degree].toString()).innerHTML = plain_modulus;
            document.getElementById("cipher_modulus_" + degrees[degree].toString()).innerHTML = cipher_modulus;
            document.getElementById("key_gen_time_" + degrees[degree].toString()).innerHTML = ((avg_key_gen_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("encryption_time_" + degrees[degree].toString()).innerHTML = ((avg_enc_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("operation_time_" + degrees[degree].toString()).innerHTML = ((avg_operation_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("decryption_time_" + degrees[degree].toString()).innerHTML = ((avg_dec_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("total_time_" + degrees[degree].toString()).innerHTML = ((avg_total_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("test_case_" + degrees[degree].toString()).innerHTML = working_case + "/" + test_cases;
            console.log("Testing done for degree: ", degrees[degree]);
            localStorage.clear()
      }
}

function use_case_5(){
      for (let degree=0; degree<degrees.length; degree++) {
            var avg_key_gen_time = 0;
            var avg_enc_time = 0;
            var avg_operation_time = 0;
            var avg_dec_time = 0;
            var avg_total_time = 0;
            var working_case = 0;

            for(let i=0; i<test_cases; i++){
                  let test_case = "((a * a) + (c * b)) + a";
                  var startTime = performance.now();
                  const params = new BFVParameters(degrees[degree], plain_modulus, cipher_modulus);
                  const key_generator = new BFVKeyGenerator(params);
                        
                  const secret_key = key_generator.secret_key;
                  const public_key = key_generator.public_key;
                  const relin_key = key_generator.relin_key;
                  var key_gen_time = (performance.now() - startTime);
                  avg_key_gen_time += key_gen_time;
                  
                  let message1 = Math.floor(Math.random() * 10);
                  let message2 = Math.floor(Math.random() * 10);
                  let message3 = Math.floor(Math.random() * 10);

                  const encoder = new IntegerEncoder(params);
                  const encryptor = new BFVEncryptor(params, public_key);

                  let encoded_plain1 = encoder.encode(message1);
                  let encoded_plain2 = encoder.encode(message2);
                  let encoded_plain3 = encoder.encode(message3);

                  let cipher1 = encryptor.encrypt(encoded_plain1);
                  let cipher2 = encryptor.encrypt(encoded_plain2);
                  let cipher3 = encryptor.encrypt(encoded_plain3);
                  var encryption_time = ((performance.now() - startTime)) - key_gen_time;
                  avg_enc_time += encryption_time;

                  const evaluator = new BFVEvaluator(params);
                  // ((a * a) + (c * b)) + a
                  let a2 = evaluator.multiply(cipher1, cipher1, relin_key);
                  let cb = evaluator.multiply(cipher3, cipher2, relin_key);
                  let a2cb = evaluator.add(a2, cb);
                  let final = evaluator.add(a2cb, cipher1);
                  var operation_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time);
                  avg_operation_time += operation_time;

                  const decryptor = new BFVDecryptor(params, secret_key);
                  let decrypted_encoded = decryptor.decrypt(final);
                  let decrypted = encoder.decode(decrypted_encoded);
                  var decryption_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time + operation_time);
                  avg_dec_time += decryption_time;

                  // ((a * a) + (c * b)) + a
                  if ((message1 * message1) + (message3 * message2) + message1 == decrypted)
                        working_case += 1;

                  var total_time = (performance.now() - startTime);    
                  avg_total_time += total_time;        
            }

            document.getElementById("plain_modulus_" + degrees[degree].toString()).innerHTML = plain_modulus;
            document.getElementById("cipher_modulus_" + degrees[degree].toString()).innerHTML = cipher_modulus;
            document.getElementById("key_gen_time_" + degrees[degree].toString()).innerHTML = ((avg_key_gen_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("encryption_time_" + degrees[degree].toString()).innerHTML = ((avg_enc_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("operation_time_" + degrees[degree].toString()).innerHTML = ((avg_operation_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("decryption_time_" + degrees[degree].toString()).innerHTML = ((avg_dec_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("total_time_" + degrees[degree].toString()).innerHTML = ((avg_total_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("test_case_" + degrees[degree].toString()).innerHTML = working_case + "/" + test_cases;
            console.log("Testing done for degree: ", degrees[degree]);
            localStorage.clear()
      }
}

function use_case_6(){
      for (let degree=0; degree<degrees.length; degree++) {
            var avg_key_gen_time = 0;
            var avg_enc_time = 0;
            var avg_operation_time = 0;
            var avg_dec_time = 0;
            var avg_total_time = 0;
            var working_case = 0;

            for(let i=0; i<test_cases; i++){
                  let test_case = "a + (b * c))";
                  var startTime = performance.now();
                  const params = new BFVParameters(degrees[degree], plain_modulus, cipher_modulus);
                  const key_generator = new BFVKeyGenerator(params);
                        
                  const secret_key = key_generator.secret_key;
                  const public_key = key_generator.public_key;
                  const relin_key = key_generator.relin_key;
                  var key_gen_time = (performance.now() - startTime);
                  avg_key_gen_time += key_gen_time;
                  
                  let message1 = Math.floor(Math.random() * 10);
                  let message2 = Math.floor(Math.random() * 10);
                  let message3 = Math.floor(Math.random() * 10);

                  const encoder = new IntegerEncoder(params);
                  const encryptor = new BFVEncryptor(params, public_key);

                  let encoded_plain1 = encoder.encode(message1);
                  let encoded_plain2 = encoder.encode(message2);
                  let encoded_plain3 = encoder.encode(message3);

                  let cipher1 = encryptor.encrypt(encoded_plain1);
                  let cipher2 = encryptor.encrypt(encoded_plain2);
                  let cipher3 = encryptor.encrypt(encoded_plain3);
                  var encryption_time = ((performance.now() - startTime)) - key_gen_time;
                  avg_enc_time += encryption_time;

                  const evaluator = new BFVEvaluator(params);
                  // a + (b * c))
                  let cb = evaluator.multiply(cipher2, cipher3, relin_key);
                  let final = evaluator.add(cipher1, cb);
                  var operation_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time);
                  avg_operation_time += operation_time;

                  const decryptor = new BFVDecryptor(params, secret_key);
                  let decrypted_encoded = decryptor.decrypt(final);
                  let decrypted = encoder.decode(decrypted_encoded);
                  var decryption_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time + operation_time);
                  avg_dec_time += decryption_time;

                  // a + (b * c))
                  if (message1 + (message2 * message3) == decrypted)
                        working_case += 1;

                  var total_time = (performance.now() - startTime);    
                  avg_total_time += total_time;        
            }

            document.getElementById("plain_modulus_" + degrees[degree].toString()).innerHTML = plain_modulus;
            document.getElementById("cipher_modulus_" + degrees[degree].toString()).innerHTML = cipher_modulus;
            document.getElementById("key_gen_time_" + degrees[degree].toString()).innerHTML = ((avg_key_gen_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("encryption_time_" + degrees[degree].toString()).innerHTML = ((avg_enc_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("operation_time_" + degrees[degree].toString()).innerHTML = ((avg_operation_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("decryption_time_" + degrees[degree].toString()).innerHTML = ((avg_dec_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("total_time_" + degrees[degree].toString()).innerHTML = ((avg_total_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("test_case_" + degrees[degree].toString()).innerHTML = working_case + "/" + test_cases;
            console.log("Testing done for degree: ", degrees[degree]);
            localStorage.clear()
      }
}

function use_case_7(){
      for (let degree=0; degree<degrees.length; degree++) {
            var avg_key_gen_time = 0;
            var avg_enc_time = 0;
            var avg_operation_time = 0;
            var avg_dec_time = 0;
            var avg_total_time = 0;
            var working_case = 0;

            for(let i=0; i<test_cases; i++){
                  let test_case = "(x * y) * (x + x)";
                  var startTime = performance.now();
                  const params = new BFVParameters(degrees[degree], plain_modulus, cipher_modulus);
                  const key_generator = new BFVKeyGenerator(params);
                        
                  const secret_key = key_generator.secret_key;
                  const public_key = key_generator.public_key;
                  const relin_key = key_generator.relin_key;
                  var key_gen_time = (performance.now() - startTime);
                  avg_key_gen_time += key_gen_time;
                  
                  let message1 = Math.floor(Math.random() * 10);
                  let message2 = Math.floor(Math.random() * 10);

                  const encoder = new IntegerEncoder(params);
                  const encryptor = new BFVEncryptor(params, public_key);

                  let encoded_plain1 = encoder.encode(message1);
                  let encoded_plain2 = encoder.encode(message2);

                  let cipher1 = encryptor.encrypt(encoded_plain1);
                  let cipher2 = encryptor.encrypt(encoded_plain2);
                  var encryption_time = ((performance.now() - startTime)) - key_gen_time;
                  avg_enc_time += encryption_time;

                  const evaluator = new BFVEvaluator(params);
                  // (x * y) * (x + x)
                  let mul = evaluator.multiply(cipher1, cipher2, relin_key);
                  let add = evaluator.add(cipher1, cipher1);
                  let final = evaluator.multiply(mul, add, relin_key);
                  var operation_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time);
                  avg_operation_time += operation_time;

                  const decryptor = new BFVDecryptor(params, secret_key);
                  let decrypted_encoded = decryptor.decrypt(final);
                  let decrypted = encoder.decode(decrypted_encoded);
                  var decryption_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time + operation_time);
                  avg_dec_time += decryption_time;

                  // (x * y) * (x + x)
                  if ((message1 * message2) * (message1 + message1) == decrypted)
                        working_case += 1;

                  var total_time = (performance.now() - startTime);    
                  avg_total_time += total_time;        
            }

            document.getElementById("plain_modulus_" + degrees[degree].toString()).innerHTML = plain_modulus;
            document.getElementById("cipher_modulus_" + degrees[degree].toString()).innerHTML = cipher_modulus;
            document.getElementById("key_gen_time_" + degrees[degree].toString()).innerHTML = ((avg_key_gen_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("encryption_time_" + degrees[degree].toString()).innerHTML = ((avg_enc_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("operation_time_" + degrees[degree].toString()).innerHTML = ((avg_operation_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("decryption_time_" + degrees[degree].toString()).innerHTML = ((avg_dec_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("total_time_" + degrees[degree].toString()).innerHTML = ((avg_total_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("test_case_" + degrees[degree].toString()).innerHTML = working_case + "/" + test_cases;
            console.log("Testing done for degree: ", degrees[degree]);
            localStorage.clear()
      }
}

function use_case_8(){
      for (let degree=0; degree<degrees.length; degree++) {
            var avg_key_gen_time = 0;
            var avg_enc_time = 0;
            var avg_operation_time = 0;
            var avg_dec_time = 0;
            var avg_total_time = 0;
            var working_case = 0;

            for(let i=0; i<test_cases; i++){
                  let test_case = "x + y + z + a";
                  var startTime = performance.now();
                  const params = new BFVParameters(degrees[degree], plain_modulus, cipher_modulus);
                  const key_generator = new BFVKeyGenerator(params);
                        
                  const secret_key = key_generator.secret_key;
                  const public_key = key_generator.public_key;
                  const relin_key = key_generator.relin_key;
                  var key_gen_time = (performance.now() - startTime);
                  avg_key_gen_time += key_gen_time;
                  
                  let message1 = Math.floor(Math.random() * 10);
                  let message2 = Math.floor(Math.random() * 10);
                  let message3 = Math.floor(Math.random() * 10);
                  let message4 = Math.floor(Math.random() * 10);

                  const encoder = new IntegerEncoder(params);
                  const encryptor = new BFVEncryptor(params, public_key);

                  let encoded_plain1 = encoder.encode(message1);
                  let encoded_plain2 = encoder.encode(message2);
                  let encoded_plain3 = encoder.encode(message3);
                  let encoded_plain4 = encoder.encode(message4);

                  let cipher1 = encryptor.encrypt(encoded_plain1);
                  let cipher2 = encryptor.encrypt(encoded_plain2);
                  let cipher3 = encryptor.encrypt(encoded_plain3);
                  let cipher4 = encryptor.encrypt(encoded_plain4);
                  var encryption_time = ((performance.now() - startTime)) - key_gen_time;
                  avg_enc_time += encryption_time;

                  const evaluator = new BFVEvaluator(params);
                  // x + y + z + a
                  let final = evaluator.add(cipher1, cipher2);
                  final = evaluator.add(final, cipher3);
                  final = evaluator.add(final, cipher4);
                  var operation_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time);
                  avg_operation_time += operation_time;

                  const decryptor = new BFVDecryptor(params, secret_key);
                  let decrypted_encoded = decryptor.decrypt(final);
                  let decrypted = encoder.decode(decrypted_encoded);
                  var decryption_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time + operation_time);
                  avg_dec_time += decryption_time;

                  // x + y + z + a
                  if (message1 + message2 + message3 + message4 == decrypted)
                        working_case += 1;

                  var total_time = (performance.now() - startTime);    
                  avg_total_time += total_time;        
            }

            document.getElementById("plain_modulus_" + degrees[degree].toString()).innerHTML = plain_modulus;
            document.getElementById("cipher_modulus_" + degrees[degree].toString()).innerHTML = cipher_modulus;
            document.getElementById("key_gen_time_" + degrees[degree].toString()).innerHTML = ((avg_key_gen_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("encryption_time_" + degrees[degree].toString()).innerHTML = ((avg_enc_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("operation_time_" + degrees[degree].toString()).innerHTML = ((avg_operation_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("decryption_time_" + degrees[degree].toString()).innerHTML = ((avg_dec_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("total_time_" + degrees[degree].toString()).innerHTML = ((avg_total_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("test_case_" + degrees[degree].toString()).innerHTML = working_case + "/" + test_cases;
            console.log("Testing done for degree: ", degrees[degree]);
            localStorage.clear()
      }
}

function use_case_9(){
      for (let degree=0; degree<degrees.length; degree++) {
            var avg_key_gen_time = 0;
            var avg_enc_time = 0;
            var avg_operation_time = 0;
            var avg_dec_time = 0;
            var avg_total_time = 0;
            var working_case = 0;

            for(let i=0; i<test_cases; i++){
                  let test_case = "x + y + z";
                  var startTime = performance.now();
                  const params = new BFVParameters(degrees[degree], plain_modulus, cipher_modulus);
                  const key_generator = new BFVKeyGenerator(params);
                        
                  const secret_key = key_generator.secret_key;
                  const public_key = key_generator.public_key;
                  const relin_key = key_generator.relin_key;
                  var key_gen_time = (performance.now() - startTime);
                  avg_key_gen_time += key_gen_time;
                  
                  let message1 = Math.floor(Math.random() * 10);
                  let message2 = Math.floor(Math.random() * 10);
                  let message3 = Math.floor(Math.random() * 10);

                  const encoder = new IntegerEncoder(params);
                  const encryptor = new BFVEncryptor(params, public_key);

                  let encoded_plain1 = encoder.encode(message1);
                  let encoded_plain2 = encoder.encode(message2);
                  let encoded_plain3 = encoder.encode(message3);

                  let cipher1 = encryptor.encrypt(encoded_plain1);
                  let cipher2 = encryptor.encrypt(encoded_plain2);
                  let cipher3 = encryptor.encrypt(encoded_plain3);
                  var encryption_time = ((performance.now() - startTime)) - key_gen_time;
                  avg_enc_time += encryption_time;

                  const evaluator = new BFVEvaluator(params);
                  // x + y + z
                  let final = evaluator.add(cipher1, cipher2);
                  final = evaluator.add(final, cipher3);
                  var operation_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time);
                  avg_operation_time += operation_time;

                  const decryptor = new BFVDecryptor(params, secret_key);
                  let decrypted_encoded = decryptor.decrypt(final);
                  let decrypted = encoder.decode(decrypted_encoded);
                  var decryption_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time + operation_time);
                  avg_dec_time += decryption_time;

                  // x + y + z
                  if (message1 + message2 + message3 == decrypted)
                        working_case += 1;

                  var total_time = (performance.now() - startTime);    
                  avg_total_time += total_time;        
            }

            document.getElementById("plain_modulus_" + degrees[degree].toString()).innerHTML = plain_modulus;
            document.getElementById("cipher_modulus_" + degrees[degree].toString()).innerHTML = cipher_modulus;
            document.getElementById("key_gen_time_" + degrees[degree].toString()).innerHTML = ((avg_key_gen_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("encryption_time_" + degrees[degree].toString()).innerHTML = ((avg_enc_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("operation_time_" + degrees[degree].toString()).innerHTML = ((avg_operation_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("decryption_time_" + degrees[degree].toString()).innerHTML = ((avg_dec_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("total_time_" + degrees[degree].toString()).innerHTML = ((avg_total_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("test_case_" + degrees[degree].toString()).innerHTML = working_case + "/" + test_cases;
            console.log("Testing done for degree: ", degrees[degree]);
            localStorage.clear()
      }
}

function use_case_10(){
      for (let degree=0; degree<degrees.length; degree++) {
            var avg_key_gen_time = 0;
            var avg_enc_time = 0;
            var avg_operation_time = 0;
            var avg_dec_time = 0;
            var avg_total_time = 0;
            var working_case = 0;

            for(let i=0; i<test_cases; i++){
                  let test_case = "(x * y) + (x * y)";
                  var startTime = performance.now();
                  const params = new BFVParameters(degrees[degree], plain_modulus, cipher_modulus);
                  const key_generator = new BFVKeyGenerator(params);
                        
                  const secret_key = key_generator.secret_key;
                  const public_key = key_generator.public_key;
                  const relin_key = key_generator.relin_key;
                  var key_gen_time = (performance.now() - startTime);
                  avg_key_gen_time += key_gen_time;
                  
                  let message1 = Math.floor(Math.random() * 10);
                  let message2 = Math.floor(Math.random() * 10);

                  const encoder = new IntegerEncoder(params);
                  const encryptor = new BFVEncryptor(params, public_key);

                  let encoded_plain1 = encoder.encode(message1);
                  let encoded_plain2 = encoder.encode(message2);

                  let cipher1 = encryptor.encrypt(encoded_plain1);
                  let cipher2 = encryptor.encrypt(encoded_plain2);
                  var encryption_time = ((performance.now() - startTime)) - key_gen_time;
                  avg_enc_time += encryption_time;

                  const evaluator = new BFVEvaluator(params);
                  // (x * y) + (x * y)
                  let mul = evaluator.multiply(cipher1, cipher2, relin_key);
                  final = evaluator.add(mul, mul);
                  var operation_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time);
                  avg_operation_time += operation_time;

                  const decryptor = new BFVDecryptor(params, secret_key);
                  let decrypted_encoded = decryptor.decrypt(final);
                  let decrypted = encoder.decode(decrypted_encoded);
                  var decryption_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time + operation_time);
                  avg_dec_time += decryption_time;

                  // (x * y) + (x * y)
                  if (2 * (message1 * message2) == decrypted)
                        working_case += 1;

                  var total_time = (performance.now() - startTime);    
                  avg_total_time += total_time;        
            }

            document.getElementById("plain_modulus_" + degrees[degree].toString()).innerHTML = plain_modulus;
            document.getElementById("cipher_modulus_" + degrees[degree].toString()).innerHTML = cipher_modulus;
            document.getElementById("key_gen_time_" + degrees[degree].toString()).innerHTML = ((avg_key_gen_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("encryption_time_" + degrees[degree].toString()).innerHTML = ((avg_enc_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("operation_time_" + degrees[degree].toString()).innerHTML = ((avg_operation_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("decryption_time_" + degrees[degree].toString()).innerHTML = ((avg_dec_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("total_time_" + degrees[degree].toString()).innerHTML = ((avg_total_time/test_cases).toFixed(3)).toString() + " ms";
            document.getElementById("test_case_" + degrees[degree].toString()).innerHTML = working_case + "/" + test_cases;
            console.log("Testing done for degree: ", degrees[degree]);
            localStorage.clear()
      }
}

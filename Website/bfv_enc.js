function enc(){
      var test_cases = 10;
      var avg_key_gen_time = 0;
      var avg_enc_time = 0;
      var avg_operation_time = 0;
      var avg_dec_time = 0;
      var avg_total_time = 0;
      var working_case = 0;
      var degree = 64;
      var plain_modulus = 3;
      var cipher_modulus = 8000000000000;

      for(let i=0; i<test_cases; i++){
            let test_case = "(x*y)+z";
            var startTime = performance.now();
            const params = new BFVParameters(degree, plain_modulus, cipher_modulus);
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
            let mul1 = evaluator.multiply(cipher1, cipher2, relin_key);
            let final = evaluator.add(mul1, cipher3);
            var operation_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time);
            avg_operation_time += operation_time;

            const decryptor = new BFVDecryptor(params, secret_key);
            let decrypted_encoded = decryptor.decrypt(final);
            let decrypted = encoder.decode(decrypted_encoded);
            var decryption_time = ((performance.now() - startTime)) - (key_gen_time + encryption_time + operation_time);
            avg_dec_time += decryption_time;

            if((message1 * message2) + message3 == decrypted)
                  working_case += 1;

            var total_time = (performance.now() - startTime);    
            avg_total_time += total_time;        
      }

      document.getElementById("degree").innerHTML = degree;
      document.getElementById("plain_modulus").innerHTML = plain_modulus;
      document.getElementById("cipher_modulus").innerHTML = cipher_modulus;
      document.getElementById("key_gen_time").innerHTML = ((avg_key_gen_time/test_cases).toFixed(3)).toString() + " ms";
      document.getElementById("encryption_time").innerHTML = ((avg_enc_time/test_cases).toFixed(3)).toString() + " ms";
      document.getElementById("operation_time").innerHTML = ((avg_operation_time/test_cases).toFixed(3)).toString() + " ms";
      document.getElementById("decryption_time").innerHTML = ((avg_dec_time/test_cases).toFixed(3)).toString() + " ms";
      document.getElementById("total_time").innerHTML = ((avg_total_time/test_cases).toFixed(3)).toString() + " ms";
      document.getElementById("test_case").innerHTML = working_case + "/" + test_cases;
}


function enc(){
      var working = "No"
      var test_case = "x*y*z";
      // var test_case = "(a+b)*(c+d)"
      var startTime = performance.now();
      let degree = 32;
      let plain_modulus = 3;
      let cipher_modulus = 8000000000000;
      const params = new BFVParameters(degree, plain_modulus, cipher_modulus);
      const key_generator = new BFVKeyGenerator(params);
            
      const secret_key = key_generator.secret_key;
      const public_key = key_generator.public_key;
      const relin_key = key_generator.relin_key;
      var key_gen_time = (performance.now() - startTime)/100;
      
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
      var encryption_time = ((performance.now() - startTime)/100) - key_gen_time;

      const evaluator = new BFVEvaluator(params);
      let final = evaluator.multiply(cipher1, cipher2, relin_key);
      final = evaluator.multiply(final, cipher3, relin_key);
      var operation_time = ((performance.now() - startTime)/100) - (key_gen_time + encryption_time);

      const decryptor = new BFVDecryptor(params, secret_key);
      let decrypted_encoded = decryptor.decrypt(final);
      let decrypted = encoder.decode(decrypted_encoded);
      var decryption_time = ((performance.now() - startTime)/100) - (key_gen_time + encryption_time + operation_time);

      if(message1 * message2 * message3 == decrypted)
            working = "YES";

      var total_time = (performance.now() - startTime)/100;            

      document.getElementById("degree").innerHTML = degree;
      document.getElementById("plain_modulus").innerHTML = plain_modulus;
      document.getElementById("cipher_modulus").innerHTML = cipher_modulus;
      document.getElementById("test_case").innerHTML = test_case;
      document.getElementById("number_1").innerHTML = message1;
      document.getElementById("number_2").innerHTML = message2;
      document.getElementById("number_3").innerHTML = message3;
      document.getElementById("key_gen_time").innerHTML = (key_gen_time.toFixed(3)).toString() + " ms";
      document.getElementById("encryption_time").innerHTML = (encryption_time.toFixed(3)).toString() + " ms";
      document.getElementById("operation_time").innerHTML = (operation_time.toFixed(3)).toString() + " ms";
      document.getElementById("decryption_time").innerHTML = (decryption_time.toFixed(3)).toString() + " ms";
      document.getElementById("output").innerHTML = decrypted;
      document.getElementById("working").innerHTML = working;
      document.getElementById("total_time").innerHTML = (total_time.toFixed(3)).toString() + " ms";
}


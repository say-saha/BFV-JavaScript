Source: https://github.com/sarojaerabelli/py-fhe
Source thesis paper: https://dspace.mit.edu/bitstream/handle/1721.1/129204/1227275316-MIT.pdf?sequence=1&isAllowed=y

Updated:
1. Added a new complex class to handle complex number operations
2. Updated the modulus. As x%y always returns x for all x < 0
3. Added new security level calculator

Code quality improvements: 
1. Added sample_gauss function 
2. Removed scaling_factor & modulus from Ciphertext constructor as not required for BFV
3. Removed scaling_factor from Plaintext constructor as not required for BFV
4. Remove 'round' parameter from multiply_fft and make rounding mandatory as it is always required.
5. Removed c2 from decrypt function and its coding as not required
6. Removed additional variable 'log_num_coeffs' in fft function -> different in original
7. Removed unnecessary variable in fft_fwd -> same in original
8. Removed unnecessary variable from add evaaluation operation -> different in original

Requirements:
1. https://www.npmjs.com/package/bignumber.js => for Node version
2. https://cdnjs.cloudflare.com/ajax/libs/bignumber.js/9.1.1/bignumber.js => For web version
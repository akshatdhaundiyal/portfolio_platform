from pwdlib import PasswordHash

# pwdlib.recommended() automatically chooses the best available algorithm (Argon2 in this case)
password_hash = PasswordHash.recommended()

class Hash():
    @staticmethod
    def bcrypt(password: str) -> str:
        """
        Hash a password. (Name remains bcrypt for compatibility, but uses Argon2 via Recommended)
        """
        return password_hash.hash(password)
    
    @staticmethod
    def verify(hashed_password: str, plain_password: str) -> bool:
        """
        Verify a password against its hash.
        """
        return password_hash.verify(plain_password, hashed_password)
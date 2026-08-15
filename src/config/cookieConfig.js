module.exports = {
    accessToken: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // jwtConfig expiresIn: '1w' ile uyumlu (1 hafta)
 
    },
  };
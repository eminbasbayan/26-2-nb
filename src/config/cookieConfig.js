module.exports = {
    accessToken: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 1000, // jwtConfig expiresIn: '1m' ile uyumlu
    },
  };
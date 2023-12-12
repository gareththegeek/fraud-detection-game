import dotenv from 'dotenv'
dotenv.config({
  silent : process.env.NODE_ENV === "production",
  CREDAL_API_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiOTlmN2Q4YmQtYWU2NS00Njk3LWI2MDgtY2EyN2M1YThlZjFhIiwiaWF0IjoxNzAyMzg4MTY5fQ.ci551ASeoakHMzQMT0H5sq40UGonzQcMMeYyPA6Kn8Q"} );

export default {};
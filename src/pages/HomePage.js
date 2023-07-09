import { Box, Grid } from "@mui/material";

const HomePage = () => {
  return (
    <div>
      <Grid container direction="row">
        <Grid item sm={6}>
          <a href="/student">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100vh"
              backgroundColor="lightblue"
            >
              <h1>I am a Student...</h1>
            </Box>
          </a>
        </Grid>

        <Grid item sm={6}>
          <a href="teacher">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100vh"
              backgroundColor="lightgreen"
            >
              <h1>I am a Teacher...</h1>
            </Box>
          </a>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;

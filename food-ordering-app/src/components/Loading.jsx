import { CircularProgress} from "@mui/material";

const Loading = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <CircularProgress />
    </div>
  );
};
export default Loading;
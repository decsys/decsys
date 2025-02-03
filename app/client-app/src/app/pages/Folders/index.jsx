import Surveys from "../Surveys";

const Folders = ({ navigate, name }) => {
  return (
    <>
      <Surveys navigate={navigate} foldersName={name} />
    </>
  );
};

export default Folders;

import Surveys from "../Surveys";

const Folders = ({ navigate, name }) => {
  return (
    <>
      <Surveys navigate={navigate} parentFolderName={name} />
    </>
  );
};

export default Folders;

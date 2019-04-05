import React, { useState, useEffect } from "react";
import { Typography, Button, Alert, Box } from "@smooth-ui/core-sc";
import { List, PlusCircle, InfoCircle } from "styled-icons/fa-solid";
import { Container, FlexBox, EmptyState } from "../../components/ui";
import SurveyList from "../../components/SurveyList";

const SurveyScreen = ({ surveys: surveyList }) => {
  const [surveys, setSurveys] = useState(surveyList);

  const handleCreateClick = () => {};

  return (
    <Container>
      <FlexBox my={3} alignItems="center" justifyContent="space-between">
        <Typography variant="h1">My Surveys</Typography>
        <Button variant="secondary" onClick={handleCreateClick}>
          <PlusCircle size="1em" /> Create new Survey
        </Button>
      </FlexBox>

      {!Object.keys(surveys).length ? (
        <Box mt={9}>
          <EmptyState
            splash={<List />}
            message="You don't have any surveys yet."
            callToAction={{
              label: "Create a survey",
              onClick: handleCreateClick
            }}
          />
        </Box>
      ) : (
        <>
          <Alert variant="info">
            <InfoCircle size="1em" /> Please don't forget to backup your surveys
            and results to an external source.
          </Alert>

          <SurveyList
            surveys={surveys}
            allowLaunch={
              Object.keys(surveys).filter(
                id => surveys[id].activeInstanceId != null
              ).length === 0
            }
          />
        </>
      )}
    </Container>
  );
};

export default SurveyScreen;

// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import {
//   Container,
//   FlexBox,
//   EmptyState,
//   LoadingIndicator
// } from "../../components/ui/";
// import { Typography, Button, Alert, Box } from "@smooth-ui/core-sc";
// import { List, PlusCircle, InfoCircle } from "styled-icons/fa-solid";
// import SurveyList from "../../components/SurveyList";
// import { createSurvey } from "../../state/ducks/surveys";

// const PureSurveysScreen = ({ onCreateClick, listLoaded, surveys }) => {
//   return (
//     <Container>
//       <FlexBox my={3} alignItems="center" justifyContent="space-between">
//         <Typography variant="h1">My Surveys</Typography>

//         <Button variant="secondary" onClick={onCreateClick}>
//           <PlusCircle size="1em" /> Create new Survey
//         </Button>
//       </FlexBox>

//       {!Object.keys(surveys).length ? (
//         listLoaded ? (
//           <Box mt={9}>
//             <EmptyState
//               splash={<List />}
//               message="You don't have any surveys yet."
//               callToAction={{
//                 label: "Create a survey",
//                 onClick: onCreateClick
//               }}
//             />
//           </Box>
//         ) : (
//           <LoadingIndicator />
//         )
//       ) : (
//         <>
//           <Alert variant="info">
//             <InfoCircle size="1em" /> Please don't forget to backup your surveys
//             and results to an external source.
//           </Alert>

//           <SurveyList
//             surveys={surveys}
//             allowLaunch={
//               Object.keys(surveys).filter(
//                 id => surveys[id].activeInstanceId != null
//               ).length === 0
//             }
//           />
//         </>
//       )}
//     </Container>
//   );
// };

// PureSurveysScreen.propTypes = {
//   onCreateClick: PropTypes.func.isRequired,
//   listLoaded: PropTypes.bool,
//   surveys: PropTypes.shape({})
// };

// PureSurveysScreen.defaultProps = { surveys: {} };

// const SurveysScreen = connect(
//   ({ surveys: { list, listLoaded } }) => ({
//     surveys: list,
//     listLoaded
//   }),
//   dispatch => ({
//     onCreateClick: () => dispatch(createSurvey())
//   })
// )(PureSurveysScreen);

// export { PureSurveysScreen };

// export default SurveysScreen;

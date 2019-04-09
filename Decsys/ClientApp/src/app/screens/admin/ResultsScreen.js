import React from "react";
import { Container } from "../../components/ui";

const ResultsScreen = ({ instances, survey }) => {
  const [instances, setInstances] = useState(instances);
  const [instanceList, setInstanceList] = useState([]);
  useEffect(() => {
    // update the list
  }, [instances]);

  const [selectedInstance, setSelectedInstance] = useState();

  const [results, setResults] = useState();

  const handleExportClick = () => {
    // export results to file
  };

  return (
    <>
      <AppBar brand="DECSYS" />
      <Container>
        <Typography variant="h2">{survey.name}</Typography>
        <Typography variant="h3">Results</Typography>
        <FlexBox mt={5}>
          <EmptyState
            message={message}
            splash={splash}
            callToAction={callToAction}
          />
        </FlexBox>
      </Container>
    </>
  );
};

/**
 * So here's the plan.
 *
 * - Navi route can pull the Instances for a single Survey
 * - Results Screen keeps the instances in state
 * - Results Screen has a dropdown for instances, ordered and displayed by published date
 * - Selecting an instance from the dropdown causes a loading state managed by the screen
 *   not by Navi
 * - loads instance results summary
 * - renders it in a basic table
 * - enables export button which simply stringifies the results data as returned from the API
 *   and writes it to a file where the user wants.
 */

export default ResultsScreen;

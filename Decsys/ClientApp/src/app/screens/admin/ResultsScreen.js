import React from "react";
import { Container } from "../../components/ui";

const ResultsScreen = () => <Container>Results</Container>;

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

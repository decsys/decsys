import ResponseItem from "./ResponseItem";
import Icon from "./Icon";
import ReactWordcloud from "react-wordcloud";

const dummyResults = [
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    text: "Rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar. Cursus sit amet dictum sit. Elementum tempus egestas sed sed risus pretium quam. Nunc non blandit massa enim nec dui nunc. Scelerisque purus semper eget duis at. Viverra vitae congue eu consequat ac felis donec et odio. Lacus viverra vitae congue eu consequat ac felis. Quisque egestas diam in arcu cursus. Tortor at auctor urna nunc id cursus metus. Pellentesque sit amet porttitor eget dolor morbi. Sed nisi lacus sed viverra tellus in hac. In nibh mauris cursus mattis molestie a iaculis at. Commodo nulla facilisi nullam vehicula ipsum a",
  },
  {
    text: "eo urna molestie at elementum eu facilisis sed odio morbi. Ac tortor vitae purus faucibus ornare suspendisse sed. Est sit amet facilisis magna. Tincidunt tortor aliquam nulla facilisi cras fermentum. At varius vel pharetra vel turpis nunc eget",
  },
  {
    text: "Nascetur ridiculus mus mauris vitae ultricies leo. Volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque in. Consectetur adipiscing elit ut aliquam purus sit amet luctus venenatis. Natoque penatibus et magnis dis parturient. Convallis aenean et tortor at risus viverra adipiscing at in. Ut diam quam nulla porttitor massa id neque aliquam. Tortor vitae purus faucibus ornare suspendisse sed nisi lacus. Ac turpis egestas integer eget aliquet nibh. Odio euismod lacinia at quis risus sed.",
  },
  {
    text: "Rhoncus est pellentesque elit ullamcorper dignissim. Euismod lacinia at quis risus sed vulputate odio ut enim. Maecenas accumsan lacus vel facilisis volutpat. Tincidunt augue interdum velit euismod in pellentesque massa placerat duis. Nibh ipsum consequat nisl vel pretium lectus quam id. Turpis cursus in hac habitasse platea dictumst quisque sagittis purus. ",
  },
];

export default {
  title: "Free Text",
  component: ResponseItem,
  argTypes: {
    logResults: { action: "logResults" },
    setIsValidResponse: { action: "setIsValidResponse" },
    clearResult: { action: "clearResult" },
    regex: {
      description:
        "The text of the regular expression. This can also be another RegExp object.",
      control: "text",
    },
    regexMessage: {
      description: "The validation Message if Regex fails",
      control: "text",
    },
  },
  args: {
    maxLength: 20,
    text: "hello World",
    regex: "^hello",
    regexMessage: "Must contain the world hello",
  },
};

export const Basic = ({
  logResults,
  setIsValidResponse,
  clearResult,
  ...args
}) => {
  const _context = { logResults, setIsValidResponse, clearResult };
  return <ResponseItem {...args} _context={_context} />;
};

export const PasswordValidation = ({
  logResults,
  setIsValidResponse,
  clearResult,
}) => {
  const _context = { logResults, setIsValidResponse, clearResult };
  return (
    <ResponseItem
      maxLength={30}
      text="Password123!"
      regex={"^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"}
      regexMessage={
        "Must contain one digit, one lower case letter, one upper case letter and be at least 8 letters long"
      }
      _context={_context}
    />
  );
};

const visualization = (stats) => () =>
  <ReactWordcloud {...stats.visualizations[0].wordcloud} />;

const stats = (stats) => () =>
  (
    <div>
      {Object.keys(stats.stats).map((x) => (
        <div key={x}>
          <h4>{x}</h4>
          <p>{stats.stats[x]}</p>
        </div>
      ))}
    </div>
  );

export const Visualisation = visualization(
  ResponseItem.stats({}, dummyResults)
);

export const Stats = stats(ResponseItem.stats({}, dummyResults));

export const MetadataIcon = () => <Icon width="24px" />;

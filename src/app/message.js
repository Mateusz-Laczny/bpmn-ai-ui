import Card from 'react-bootstrap/Card';

function Message({ user, messageText }) {
  console.log(user);
  return (
    <Card>
      <Card.Header>{user}</Card.Header>
      <Card.Body>{messageText}</Card.Body>
    </Card>
  );
}

export default Message;

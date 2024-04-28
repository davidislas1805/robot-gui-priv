import Table from 'react-bootstrap/Table';
import './serialTableTemplate.css';

function SerialPortsTable({array}) {
  const sendSelectedDevice = (path) => {
    window.ipcRenderer.send('device-explorer-comp:serial-device-name', path);
    document.querySelector('.content-pointer-event-none').style.pointerEvents = 'none';
  };
  return (
    <div className="content-pointer-event-none">
      <Table striped bordered hover variant="dark">
        <tbody>
          {array.map((item) => {
            return (
              <tr key={ item } onClick={(e) => {
                sendSelectedDevice(item);
                }}>
                <td>{ item }</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
)};
export default SerialPortsTable;
import (
	"time"
	"encoding/json"
	"iotsrv/logger"
	"strconv"
)


const (
	MSG_TYPE_DEFAULT byte = 1
)

//type MessageBody interface {
//	Data() map[string]interface{}
//	Bytes() []byte
//	Id() string
//}
//
//type BaseMessageBody struct {
//	data map[string]interface{};
//	id string;
//}
//
//func NewBaseMessageBody(mapBody map[string]interface{}) *BaseMessageBody{
//	id := strconv.FormatInt(time.Now().UnixNano() / 1000, 36);
//	mapBody["MsgID"] = id;
//	logger.Info("NewBaseMessageBody", mapBody["MsgId"]);
//	return &BaseMessageBody{
//		id : id,
//		data : mapBody,
//	}
//}
//
//func (self *BaseMessageBody) Data() map[string]interface{}{
//	return self.data;
//}
//
//
//func (self *BaseMessageBody) Bytes() []byte{
//	msgBody, err := json.Marshal(self.data)
//	if err != nil {
//		return nil
//	}
//	logger.Info(string(msgBody));
//	return msgBody
//}
//
//func (self *BaseMessageBody) Id() string{
//	return self.id;
//}


type Message struct {
	ID        string
	Type       byte

	Body      map[string]interface{};
	Timestamp int64
	Attempts  int64
}

func NewMessage(body map[string]interface{}) *Message {
	id := strconv.FormatInt(time.Now().UnixNano() / 1000, 36);
	body["MsgID"] = id;
	return &Message{
		ID:        id,
		Type:      MSG_TYPE_DEFAULT,
		Body:      body,
		Timestamp: time.Now().UnixNano(),
		Attempts: 0,
	}
}

func (self *Message) Bytes() []byte{
	msgBody, err := json.Marshal(self.Body)
	if err != nil {
		return nil
	}
	logger.Info(string(msgBody));
	return msgBody
}

func (self *Message) Id() string{
	return self.ID;
}



//func (m *Message) WriteTo(w io.Writer) (int64, error) {
//	var buf [10]byte
//	var total int64
//
//	binary.BigEndian.PutUint64(buf[:8], uint64(m.Timestamp))
//	binary.BigEndian.PutUint16(buf[8:10], uint16(m.Attempts))
//
//	n, err := w.Write(buf[:])
//	total += int64(n)
//	if err != nil {
//		return total, err
//	}
//
//	n, err = w.Write(m.ID[:])
//	total += int64(n)
//	if err != nil {
//		return total, err
//	}
//
//	n, err = w.Write(m.Body)
//	total += int64(n)
//	if err != nil {
//		return total, err
//	}
//
//	return total, nil
//}

//func decodeMessage(b []byte) (*Message, error) {
//	var msg Message
//
//	if len(b) < minValidMsgLength {
//		return nil, fmt.Errorf("invalid message buffer size (%d)", len(b))
//	}
//
//	msg.Timestamp = int64(binary.BigEndian.Uint64(b[:8]))
//	msg.Attempts = binary.BigEndian.Uint16(b[8:10])
//
//	buf := bytes.NewBuffer(b[10:])
//
//	_, err := io.ReadFull(buf, msg.ID[:])
//	if err != nil {
//		return nil, err
//	}
//
//	msg.Body, err = ioutil.ReadAll(buf)
//	if err != nil {
//		return nil, err
//	}
//
//	return &msg, nil
//}

//func writeMessageToBackend(buf *bytes.Buffer, msg *Message, bq BackendQueue) error {
//	buf.Reset()
//	_, err := msg.WriteTo(buf)
//	if err != nil {
//		return err
//	}
//	return bq.Put(buf.Bytes())
//}


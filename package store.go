package store

import (
	"github.com/syndtr/goleveldb/leveldb"
	"iotsrv/logger"
	"path/filepath"
	"github.com/syndtr/goleveldb/leveldb/util"
	"github.com/syndtr/goleveldb/leveldb/iterator"
)


type DataStore interface{
	Get(key []byte) (value []byte, err error)
	Put(key []byte, value []byte) (error)
	GetStatus(key []byte) (value []byte, err error)
	PutStatus(key []byte, value []byte) (error)
	GetDataIterator(key []byte) (iterator.Iterator)
	GetDataIteratorByRange(slice *util.Range) (iterator.Iterator)
}

type LevelDBDataStore struct {
	tsdb     *leveldb.DB
	statusdb *leveldb.DB
}

func NewLevelDBDataStore(path string) *LevelDBDataStore {

	tsdb, err := leveldb.OpenFile(filepath.Join(path, "./data/tsdata"), nil)
	if err != nil {
		logger.Error("store engine init failed ", err)
		panic(err)
	}
	statusdb, err := leveldb.OpenFile(filepath.Join(path, "./data/status"), nil)
	if err != nil {
		logger.Error("store engine init failed ", err)
		panic(err)
	}
	return &LevelDBDataStore{
		tsdb : tsdb,
		statusdb : statusdb,
	}
}

func (self*LevelDBDataStore) Get(key []byte) (value []byte, err error) {
	value, err = self.tsdb.Get(key, nil)
	return
}

func (self*LevelDBDataStore) Put(key []byte, value []byte) (error) {
	logger.Info("saving ts data", string(key))
	return self.tsdb.Put(key, value, nil)
}

func (self*LevelDBDataStore) GetStatus(key []byte) (value []byte, err error) {
	value, err = self.statusdb.Get(key, nil)
	return
}

func (self *LevelDBDataStore) PutStatus(key []byte, value []byte) (error) {
	logger.Info("saving status", string(key))
	return self.statusdb.Put(key, value, nil)
}

func (self *LevelDBDataStore) GetDataIterator(key []byte) (iterator.Iterator) {
	return self.tsdb.NewIterator(util.BytesPrefix(key), nil)
}

func (self *LevelDBDataStore) GetDataIteratorByRange(slice *util.Range) (iterator.Iterator) {
	return self.tsdb.NewIterator(slice, nil)
}

func (self*LevelDBDataStore) Close() {
	self.tsdb.Close()
	self.statusdb.Close()
}
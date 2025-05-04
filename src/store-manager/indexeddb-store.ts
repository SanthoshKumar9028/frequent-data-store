import { BaseStore } from "./base-store";

export class IndexedDBStore<Document> extends BaseStore<Document> {
  private storeName: string;
  private _db: IDBDatabase | null;

  constructor(storeName: string, db: IDBDatabase | null = null) {
    super();
    this.storeName = storeName;
    this._db = db;
  }

  setDB(db: IDBDatabase) {
    this._db = db;
  }

  private validateAndGetDB() {
    if (!this._db) throw new Error("Indexed DB is undefined");
    return this._db;
  }

  add(payload: Document): Promise<Document> {
    const db = this.validateAndGetDB();
    const tx = db.transaction(this.storeName, "readwrite");
    const store = tx.objectStore(this.storeName);
    const req = store.add(payload);

    return new Promise((res, rej) => {
      req.onsuccess = () => res(payload);
      req.onerror = (e) => rej(this.parseError(e));
    });
  }
  findAll(): Promise<Document[]> {
    const db = this.validateAndGetDB();
    const tx = db.transaction(this.storeName, "readonly");
    const store = tx.objectStore(this.storeName);
    const req = store.getAll();

    return new Promise((res, rej) => {
      req.onsuccess = () => res(req.result || []);
      req.onerror = (e) => rej(this.parseError(e));
    });
  }
  findByKey(id: string): Promise<Document | undefined> {
    const db = this.validateAndGetDB();
    const tx = db.transaction(this.storeName, "readonly");
    const store = tx.objectStore(this.storeName);
    const req = store.get(id);

    return new Promise((res, rej) => {
      req.onsuccess = () => res(req.result);
      req.onerror = (e) => rej(this.parseError(e));
    });
  }
  findOneAndUpdate(
    id: string,
    getNewDocument: (oldDoc: Document) => Document
  ): Promise<Document> {
    const db = this.validateAndGetDB();
    const tx = db.transaction(this.storeName, "readwrite");
    const store = tx.objectStore(this.storeName);
    const oldDocReq = store.get(id);

    return new Promise<Document>((res, rej) => {
      oldDocReq.onsuccess = () => {
        if (oldDocReq.result) {
          res(oldDocReq.result);
        } else {
          rej(new Error(`Document with key ${id} is not found`));
        }
      };
      oldDocReq.onerror = (e) => rej(this.parseError(e));
    }).then((oldDoc) => {
      const newDocument = getNewDocument(oldDoc);
      const updateReq = store.put(newDocument);

      return new Promise<Document>((res, rej) => {
        updateReq.onsuccess = () => res(newDocument);
        updateReq.onerror = (e) => rej(this.parseError(e));
      });
    });
  }
  update(payload: Document): Promise<Document> {
    const db = this.validateAndGetDB();
    const tx = db.transaction(this.storeName, "readwrite");
    const store = tx.objectStore(this.storeName);
    const req = store.put(payload);

    return new Promise((res, rej) => {
      req.onsuccess = () => res(payload);
      req.onerror = (e) => rej(this.parseError(e));
    });
  }
  delete(id: string): Promise<string> {
    const db = this.validateAndGetDB();
    const tx = db.transaction(this.storeName, "readwrite");
    const store = tx.objectStore(this.storeName);
    const req = store.delete(id);

    return new Promise((res, rej) => {
      req.onsuccess = (e) => res(e.type);
      req.onerror = (e) => rej(this.parseError(e));
    });
  }

  parseError(event: Event) {
    if (!event.target) return new Error("Something went wrong...");
    if ("error" in event.target) {
      return event.target.error;
    }
    return null;
  }
}

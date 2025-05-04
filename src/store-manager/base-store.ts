/* eslint-disable @typescript-eslint/no-unused-vars */
export class BaseStore<Document> {
  add(_: Document): Promise<Document> {
    throw new Error("Method not implemented.");
  }
  findOneAndUpdate(_: string, __: (oldDoc: Document) => Document): Promise<Document> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<Document[]> {
    throw new Error("Method not implemented.");
  }
  findByKey(_: string): Promise<Document | undefined> {
    throw new Error("Method not implemented.");
  }
  update(_: Document): Promise<Document> {
    throw new Error("Method not implemented.");
  }
  delete(_: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
}

import * as vscode from "vscode";

import { AtelierAPI } from "../api";
import { ClassNode } from "../explorer/models/classesNode";
import { PackageNode } from "../explorer/models/packageNode";
import { RootNode } from "../explorer/models/rootNode";
import { RoutineNode } from "../explorer/models/routineNode";
import { explorerProvider } from "../extension";
import { outputChannel } from "../utils";
import { fireOtherStudioAction, OtherStudioAction } from "./studio";
import { DocumentContentProvider } from "../providers/DocumentContentProvider";

function deleteList(items: string[], workspaceFolder: string): Promise<any> {
  if (!items || !items.length) {
    vscode.window.showWarningMessage("Nothing to export");
  }

  const api = new AtelierAPI();
  api.setConnection(workspaceFolder);
<<<<<<< HEAD
  return Promise.all(items.map((item) => api.deleteDoc(item))).then((files) => {
    // Trigger the server's response from the delete
    // user action, which is provided in file.result.ext
    files.forEach((file) => {
      const uri = DocumentContentProvider.getUri(file.result.name);
      fireOtherStudioAction(OtherStudioAction.DeletedDocument, uri, file.result.ext);
    });
    outputChannel.appendLine(`Deleted items: ${files.filter(el => el.result).length}`);
    const failed = files.filter((el) => !el.result).map((el) => `${el.file} - ${el.error}`);
    if (files.find((el) => !el.result)) {
=======
  return Promise.all(items.map((item) => api.deleteDoc(item))).then((files) => {
    outputChannel.appendLine(`Deleted items: ${files.filter((el) => el.result).length}`);
    const failed = files.filter((el) => !el.result).map((el) => `${el.file} - ${el.error}`);
    if (files.find((el) => !el.result)) {
>>>>>>> master
      outputChannel.appendLine(`Items failed to delete: \n${failed.join("\n")}`);
    }
  });
}

export async function deleteItem(node: RootNode | PackageNode | ClassNode | RoutineNode): Promise<any> {
  const workspaceFolder = node.workspaceFolder;
  const nodesList = node instanceof RootNode ? node.getChildren(node) : Promise.resolve([node]);
  return nodesList
    .then((nodes) =>
      nodes.reduce(
        (list, subNode) => list.concat(subNode instanceof PackageNode ? subNode.getClasses() : [subNode.fullName]),
        []
      )
    )
    .then((items) => {
      deleteList(items, workspaceFolder);
      explorerProvider.refresh();
    });
}

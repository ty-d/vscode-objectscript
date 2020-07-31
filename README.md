[![Known Vulnerabilities](https://snyk.io/test/github/intersystems-community/vscode-objectscript/badge.svg)](https://snyk.io/test/github/intersystems-community/vscode-objectscript)
![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/daimor.vscode-objectscript.svg)
[![](https://img.shields.io/visual-studio-marketplace/i/daimor.vscode-objectscript.svg)](https://marketplace.visualstudio.com/items?itemName=daimor.vscode-objectscript)

[![](https://img.shields.io/badge/InterSystems-IRIS-blue.svg)](https://www.intersystems.com/products/intersystems-iris/)
[![](https://img.shields.io/badge/InterSystems-Caché-blue.svg)](https://www.intersystems.com/products/cache/)
[![](https://img.shields.io/badge/InterSystems-Ensemble-blue.svg)](https://www.intersystems.com/products/ensemble/)

# vscode-objectscript

[InterSystems](http://www.intersystems.com/our-products/) ObjectScript language support for Visual Studio Code.

## Features

- InterSystems ObjectScript code highlighting support.
  ![example](https://raw.githubusercontent.com/intersystems-community/vscode-objectscript/master/images/screenshot.png)
- Debugging ObjectScript code.
- Intellisense support for commands, system functions, and class members.
- Export existing sources to the working directory: press Cmd/Ctrl+Shift+P, type 'ObjectScript', press Enter.
- Save and compile a class: press <kbd>Ctrl</kbd>+<kbd>F7</kbd> (<kbd>⌘</kbd>+<kbd>F7</kbd>) or select "ObjectScript: Import and Compile Current File" from <kbd>Cmd</kbd>/<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> menu.
- Direct access to edit or view server code VSCode Explorer via `isfs` and `isfs-readonly` FileSystemProviders (e.g. using a [multi-root workspace](https://code.visualstudio.com/docs/editor/multi-root-workspaces)).
- Server Explorer view (ObjectScript: Explorer) with ability to export items to working directory. ![ServerExplorer](https://raw.githubusercontent.com/intersystems-community/vscode-objectscript/master/images/explorer.png)

## Installation

Install [Visual Studio Code](https://code.visualstudio.com/) first.

Open VSCode. Go to extensions and search for "ObjectScript" like it is shown on the attached screenshot and install it.
Or install from ObjectScript extension page on [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=daimor.vscode-objectscript)
![installation](https://raw.githubusercontent.com/intersystems-community/vscode-objectscript/master/images/installation.gif)

## Configure Connection

To be able to use many features you first need to configure the connection to your IRIS/Caché/Ensemble server(s) in your [VSCode settings](https://code.visualstudio.com/docs/getstarted/settings). If you are unfamiliar with how settings work and how they are edited, use that link.

We recommend you define server connections in the `intersystems.servers` object whose structure is defined by the [InterSystems Server Manager](https://marketplace.visualstudio.com/items?itemName=intersystems-community.servermanager) helper extension. Install this extension to get assistance when editing the JSON definition. For example:

```json
	"intersystems.servers": {
		"local": {
			"webServer": {
				"scheme": "http",
				"host": "127.0.0.1",
				"port": 52773
			},
      		"description": "My local IRIS",
      		"username": "me"
		}
  }
```

By defining connections in your User Settings they become available for use by any workspace you open in VSCode. Alternatively, define them in workspace-specific settings.

Setting the `username` property is optional. If omitted it will be prompted for when connecting, then cached for the session..

Setting a plaintext value for the `password` property is not recommended. Instead, run the `InterSystems Server Manager: Store Password in Keychain` command from Command Palette.

If no password has been set or stored it will be prompted for when connecting, then cached for the session.

### Client-side Editing

A workspace consisting of a local working directory in which you edit InterSystems source files and manage them using client-side source control (e.g. Git) will use the `objectscript.conn` settings object to access the server for export (compile) and debug, and also for import. This is usually defined in Workspace Settings, for example in the `.vscode/settings.json` file of your working directory.

We recommend that `objectscript.conn` uses its `server` property to point to an entry in `intersystems.servers`. For example:

```json
  "objectscript.conn": {
    "active": true,
    "server": "local",
    "ns": "USER"
  }
```

The mandatory `ns` property defines which server namespace you will work with.

When the `server` property is set, any `username` or `password` properties of `objectscript.conn` are ignored. Instead these values come from the `intersystems.servers` entry.

### Server-side Editing

To edit code directly in one or more namespaces on one or more servers (local or remote) we recommend creating a workspace definition file (XYZ.code-workspace) in which you specify one or more root folders that directly access namespaces via the `isfs` or `isfs-readonly` URI schemes. The only difference between these two schemes is that any file opened from a folder using the `isfs-readonly` scheme will be set as readonly in VSCode and thus protected against changing.

1. Start VSCode.
2. If your last-used folder opens, use 'Close Folder' on the 'File' menu ('Code' menu on macOS). Or if what opened was your last-used workspace, use 'Close Workspace'.
3. Use 'Save Workspace As...' to create an empty file with a .code-workspace extension.
4. Use the Command Palette to run 'Preferences: Open Workspace Settings (JSON)'.
5. Add a `folders` array that defines one or more root folders for your workspace. The `uri` property of each folder specifies whether to use `isfs` or `isfs-readonly`, and which entry within `intersystems.servers` to get the connection definition from. All example here reference one named `local`. Add a `ns` query parameter to specify which namespace to access. Optionally add a `label` property to set the display name of the folder in Explorer. Optionally add a workspace-specific `settings` object to hide the ObjectScript Explorer view, which is not usually needed when working server-side in this way.

```json
{
	"folders": [
		{
			"name": "local:USER",
			"uri": "isfs://local/?ns=USER"
		},
		{
			"name": "local:USER (readonly)",
			"uri": "isfs-readonly://local/?ns=USER"
		}
	],
	"settings": {
		"objectscript.showExplorer": false
	}
}
```

To access the server-side files of a web application, format your `uri` property like this:

```json
    {
      "uri": "isfs://local/csp/user/?&csp&ns=USER"
    }
```
The `csp` query parameter indicates web application files are to be shown. The uri path specifies which application. The `ns` parameter must specify the same namespace the application is configured to use.

To see only classes in the X.Y package, format the uri like this:

```json
		{
			"uri": "isfs://local/X/Y?ns=USER&type=cls"
		}
```

Other query parameters that can be specified:
- `type=cls` to show only classes, or `type=rtn` to show only routines.
- `flat=1` to flatten the hierarchy.
- `generated=1` to show generated items.
- `filter=filterspec` to use a filter specification formatted in the same way as used in InterSystems Studio's File Open dialog (e.g. `filter=Ensem*.inc`).

## Notes

Connection-related output appears in the "Output" view while switched to the "ObjectScript" channel using the drop-down menu on the view titlebar.

For Caché/IRIS instance with maximum security level, add `%Development` role for `/api/atelier/` web-application ([read more](https://community.intersystems.com/post/using-atelier-rest-api)).

If you are getting `ERROR #5540: SQLCODE: -99 Message: User xxx is not privileged for the operation` when you try to get/refresh class/routine/includes lists, grant your username (or a SQL role you hold) execute permission for the following SQL Procedure in the target namespace.
```SQL
GRANT EXECUTE ON %Library.RoutineMgr_StudioOpenDialog TO xxx
```

## Support and Training

[CaretDev](https://caretdev.com/#products) provides commercial support services. [Request a Quote](https://caretdev.com/contact-us/).

On-line course from CaretDev - [Developing with VSCode ObjectScript – Easy Start](https://caretdev.com/courses/).

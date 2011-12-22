/******************************************************************************* 
 * @license
 * Copyright (c) 2011 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 * 
 * Contributors: IBM Corporation - initial API and implementation
 ******************************************************************************/

var eclipse;
/*global define document dojo dijit serviceRegistry:true */
/*browser:true*/
define(['require', 'dojo', 'orion/bootstrap', 'orion/status', 'orion/progress', 'orion/util', 'orion/commands', 'orion/dialogs', 'orion/selection', 
        'orion/fileClient', 'orion/operationsClient', 'orion/searchClient', 'orion/globalCommands',
        'orion/git/gitRepositoryExplorer', 'orion/git/gitCommands', 'orion/git/gitClient', 'orion/links',
	    'dojo/parser', 'dojo/hash', 'dijit/layout/BorderContainer', 'dijit/layout/ContentPane', 'orion/widgets/eWebBorderContainer'], 
		function(require, dojo, mBootstrap, mStatus, mProgress, mUtil, mCommands, mDialogs, mSelection, 
				mFileClient, mOperationsClient, mSearchClient, mGlobalCommands, 
				mGitRepositoryExplorer, mGitCommands, mGitClient, mLinks) {

mBootstrap.startup().then(function(core) {
	var serviceRegistry = core.serviceRegistry;
	var preferences = core.preferences;
	document.body.style.visibility = "visible";
	dojo.parser.parse();
	
	new mStatus.StatusReportingService(serviceRegistry, "statusPane", "notifications");
	new mDialogs.DialogService(serviceRegistry);
	var selection = new mSelection.Selection(serviceRegistry);
	var commandService = new mCommands.CommandService({serviceRegistry: serviceRegistry});
	var operationsClient = new mOperationsClient.OperationsClient(serviceRegistry);
	new mProgress.ProgressService(serviceRegistry, operationsClient);
	
	// ...
	var searcher = new mSearchClient.Searcher({serviceRegistry: serviceRegistry});
	var linkService = new mLinks.TextLinkService({serviceRegistry: serviceRegistry});
	var gitClient = new mGitClient.GitService(serviceRegistry);
	var fileClient = new mFileClient.FileClient(serviceRegistry);
	
	var explorer = new mGitRepositoryExplorer.GitRepositoryExplorer(serviceRegistry, linkService, /* selection */ null, "artifacts", "pageActions"/*, "selectionTools"*/);
	mGlobalCommands.generateBanner("toolbar", serviceRegistry, commandService, preferences, searcher, explorer);
	
	// define commands
	mGitCommands.createFileCommands(serviceRegistry, commandService, explorer, "pageActions", "selectionTools");
	mGitCommands.createGitClonesCommands(serviceRegistry, commandService, explorer, "pageActions", "selectionTools", fileClient);

	// define the command contributions - where things appear, first the groups
	
	// object contributions
	commandService.registerCommandContribution("eclipse.openCloneContent", 100);
	commandService.registerCommandContribution("eclipse.openGitStatus", 100);
	commandService.registerCommandContribution("eclipse.openGitLog", 100);
	
	commandService.registerCommandContribution("eclipse.removeBranch", 1000);
	
	commandService.registerCommandContribution("eclipse.checkoutTag", 1000);
	
	
	fileClient.loadWorkspace().then(
		function(workspace){
			var path = dojo.hash() || workspace.Location;
			var relativePath = mUtil.makeRelative(path);
			
			//NOTE: require.toURL needs special logic here to handle "gitapi/clone"
			var gitapiCloneUrl = require.toUrl("gitapi/clone._");
			gitapiCloneUrl = gitapiCloneUrl.substring(0,gitapiCloneUrl.length-2);
			
			explorer.displayRepository(relativePath[0] === "/" ? gitapiCloneUrl + relativePath : gitapiCloneUrl + "/" + relativePath);
		}	
	);	
	
	//every time the user manually changes the hash, we need to load the workspace with that name
	dojo.subscribe("/dojo/hashchange", explorer, function() {
		fileClient.loadWorkspace().then(
			function(workspace){
				var path = dojo.hash() || workspace.Location;
				var relativePath = mUtil.makeRelative(path);
				
				//NOTE: require.toURL needs special logic here to handle "gitapi/clone"
				var gitapiCloneUrl = require.toUrl("gitapi/clone._");
				gitapiCloneUrl = gitapiCloneUrl.substring(0,gitapiCloneUrl.length-2);
				
				explorer.displayRepository(relativePath[0] === "/" ? gitapiCloneUrl + relativePath : gitapiCloneUrl + "/" + relativePath);
			}	
		);	
	});

//	makeRightPane(explorer);
});

/*function makeRightPane(explorer){
	// set up the splitter bar and its key binding
	var splitArea = dijit.byId("orion.innerNavigator");
	
	//by default the pane should be closed
	if(splitArea.isRightPaneOpen()){
		splitArea.toggle();
	}
			
	var bufferedSelection = [];
	
	window.document.onkeydown = function (evt){
		evt = evt || window.event;
		var handled = false;
		if(evt.ctrlKey && evt.keyCode  === 79){ // Ctrl+o handler for toggling outline 
			splitArea.toggle();
			handled = true;			
		} 
		if (handled) {
			if (window.document.all) { 
				evt.keyCode = 0;
			} else { 
				evt.preventDefault();
				evt.stopPropagation();
			}		
		}
	};
}*/

//end of define
});

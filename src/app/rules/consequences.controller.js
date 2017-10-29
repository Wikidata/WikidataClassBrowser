define(['rules/rules.module',
		'rules/ast.service',
		'rules/matcher.service',
		'rules/rules.service',
		'util/util.service',
		'util/sparql.service',
		'util/sqidStatementTable.directive',
		'i18n/i18n.service'
	   ],
function() {
	angular.module('rules').controller('ConsequencesController',
	['$scope', '$translate', '$q', '$routeParams',
	'i18n', 'rules', 'ast', 'matcher', 'sparql', 'util', 'wikidataapi',
	 function($scope, $translate, $q, $routeParams,
			  i18n, rules, ast, matcher, sparql, util, wikidataapi) {
		 $scope.rule = JSON.parse($routeParams.rule);
		 $scope.statements = null;
		 $scope.query = matcher.getInstanceCandidatesQuery($scope.rule, [], 101);
		 sparql.getQueryRequest(
			 $scope.query.query
		 ).then(function(results) {
			 return rules.handleSparqlResults($scope.query, results);
		 }).then(
			 rules.injectReferences
		 ).then(function(results) {
			 var properties = [];

			 return i18n.waitForPropertyLabels(
				 properties
			 ).then(function() {
					 return results;
				 });
		 }).then(function(results) {
			 return i18n.waitForTerms(util.unionArrays(
				 results.requests.entityIds,
				 [])).then(function() {
					 return results;
				 });
		 }).then(function(results) {
			 var claims = [];
			 var property = undefined;
			 var head = $scope.query.rule.head;

			 if (('name' in head.predicate) &&
				 ('type' in head.predicate)) {
				 property = head.predicate.name;
			 } else if (head.predicate.name in $scope.query.bindings) {
				 property = $scope.query.bindings[head.predicate.name];
			 } else {
				 property = head.predicate;
			 }

			 $scope.query.property = property;

			 angular.forEach(results.statements, function(claim) {
				 var subject = claim[property][0].proposalFor;

				 if (!(subject in claims)) {
					 claims.push(subject);
				 }
			 });

			 return wikidataapi.getEntityClaimForProperty(
				 claims,
				 property
			 ).then(function(entities) {
				 var property = $scope.query.property;
				 var proposals = {};
				 var claims = {};

				 angular.forEach(entities, function(claim) {
					 if (!(property in claim.claims) ||
						 claim.claims[property].length === 0) {
						 return;
					 }

					 var claimFor = claim.claims[property][0]
						 .id.split('$', 1)[0]
						 .toUpperCase();

					 if (!(claimFor in claims)) {
						 claims[claimFor] = {};
						 claims[claimFor][property] = [];
					 }

					 claims[claimFor][property] =
						 claims[claimFor][property].concat(
							 claim.claims[property]
						 );
				 });

				 angular.forEach(results.statements, function(proposal) {
					 var proposalFor = proposal[property][0].proposalFor
						 .toUpperCase();

						 if (!(proposalFor in proposals)) {
							 proposals[proposalFor] = {};
							 proposals[proposalFor][property] = [];
						 }

						 proposals[proposalFor][property] =
							 proposals[proposalFor][property].concat(
								 proposal
							 );
				 });

				 var statements = {};

				 angular.forEach(proposals, function(proposal, subject) {
					 if (!(subject in statements)) {
						 statements[subject] = [];
					 }

					 if (!(subject in claims)) {
						 claims[subject] = [];
					 }

					 var stmts = rules.deduplicateStatements(
						 { statements: claims[subject] },
						 [{ statements: proposal[property][0] }]
					 );

					 if (Object.keys(stmts).length > 0) {
						 statements[subject] = statements[subject].concat(
							 proposal[property]
						 );
					 }

				 });

				 var result = {};
				 result[property] = [];

				 angular.forEach(statements, function(stmt) {
					 angular.forEach(stmt[0], function(snak, prop) {
						 result[property] = result[property].concat(snak);
					 });
				 });

				 return result;
			 });
		 }).then(function(results) {
			 $scope.statements = {
				 statements: results
			 };
		 });

	 }]);

	return {};
});
class Help {
	static startTutorial() {
		Help.tutorial.init();
		Help.tutorial.start(true);
	}

	static clear() {
		$('#help-toc').empty();
		$('#help-content').empty();
	}

	static hide() {
		$('#help').hide();
		Help.clear();
		Help.current = undefined;
		localStorage.removeItem('help');
		localStorage.removeItem('help-page');
	}

	static show() {
		$('#help').show();
	}

	static tableofcontents(helpTitle, helpContent) {
		if (Help.current === helpContent) {
			return;
		}
		Help.clear();
		Help.current = helpContent;
		var list = $('<ul></ul>');
		$('#help-toc')
		.append(
			$('<div class="card border-info"></div>')
			.append(
				$('<div class="card-header bg-info"></div>')
				.append(
					$('<button type="button" class="close" onclick="Help.hide()"></button>')
					.append(
						$('<span>&times;</span>')
					),
					$('<h3></h3>').text(helpTitle)
				),
				$('<div class="card-body"></div>')
				.append(list)
			)
		);
		for (var e of helpContent.entries()) {
			var index = e[0];
			var page = e[1];
			list.append('<li class="toc-item" onclick="Help.page('+index+')">'+page.title+'</li>');
		}
		Help.show();
		localStorage.setItem('help', helpTitle);
		localStorage.removeItem('help-page');
	}

	static page(index) {
		$('.toc-item-selected').removeClass('toc-item-selected');
		$('.toc-item').slice(index, index+1).addClass('toc-item-selected');
		var page = Help.current[index];
		var body = page.body();
		$('#help-content')
			.empty()
			.append(
				$('<div class="container-fluid"></div>').append(
					body
				)
			);
		localStorage.setItem('help-page', index);
	}

	static placeholder(placeholder, body) {
		return Element.highlight('$'+placeholder+'$').add($('<span> is </span>')).add(((typeof body) === 'string') ? $('<span></span>').html(body) : body);
	}
}
Help.tutorial = new Tour({
	storage: false,
	onEnd: function(tour) { localStorage.setItem('seen-tutorial', 'true'); },
   	template: '<div class="popover" role="tooltip"> <div class="arrow"></div> <h3 class="popover-header bg-info"></h3> <div class="popover-body"></div> <div class="popover-navigation"> <div class="btn-group"> <button class="btn btn-sm btn-info" data-role="prev">&laquo; Prev</button> <button class="btn btn-sm btn-info" data-role="next">Next &raquo;</button> <button class="btn btn-sm btn-secondary" data-role="pause-resume" data-pause-text="Pause" data-resume-text="Resume">Pause</button> </div> <button class="btn btn-sm btn-info" data-role="end">Skip</button> </div> </div>',
	steps: [
	{
		orphan: true,
		backdrop: true,
		title: "Welcome to Yadrol!",
		content: "<p>Yadrol is a dice simulator. It presents the dice results or the result distribution after rolling thousands of times.</p> <p>Yadrol is designed for tabletop role playing games and boardgames enthousiasts, especially those who want to study existing dice mechanics or to create new mechanics.</p>"
	},
	{
		element: ".CodeMirror-wrap",
		backdrop: true,
		title: "How does it work?",
		content: "<p>This is the area where you specify the dice mechanics to simulate.</p> <p>The dice mechanics is written as an expression in a language designed to capture the most widely used dice mechanics.</p>"
	},
	{
		element: ".CodeMirror-wrap",
		backdrop: true,
		title: "Dice expression basics.",
		content: "<p>Let's try something simple.</p> <p>The core expression to specify a dice is <code>NdX</code> , where <var>N</var> is the number of dice to roll, and <var>X</var> is the number of sides of each die.</p> <p>For instance <code>3d6</code> tells Yadrol to roll three six-sided die.</p>",
		onShow: function(tour) { Action.setExpressionString('3d6'); }
	},
	{
		element: "#run-button",
		backdrop: true,
		title: "Run the simulation",
		content: "<p>To run the simulation, click this button.</p>",
		reflex: true,
		placement: 'bottom',
		onHide: function(tour) { Action.run(); }
	},
	{
		element: "#sample-records",
		backdrop: true,
		title: "Aha! You blinked!",
		content: "<p>Yadrol has rolled your dice several thousand of times.</p> <p>This chart represents the frequency of Yadrol roll results.</p>",
		placement: 'left'
	},
	{
		element: "#y-button-group",
		backdrop: true,
		title: "Y axis values",
		content: "<p>By default Yadrol displays as Y-axis the frequency to obtain <emph>at least</emph> the result.</p> <p>These buttons allow you to chose <emp>exact</emph> or <emph>at most</emph> as Y-axis.</p>",
		placement: 'left'
	},
	{
		element: "#sample-records",
		backdrop: true,
		title: "Mean value",
		content: "<p>The little inverted triangle indicates the <emph>mean</emph> value.</p>",
		placement: 'bottom'
	},
	{
		element: "#centrum-button-group",
		backdrop: true,
		title: "Centrum values",
		content: "<p>Though these buttons let you choose either to place the triangle on the <emph>mean</emph>, the <emph>mode</emph>, or the <emph>median</emph>.</p>",
		placement: 'bottom'
	},
	{
		element: "#output-modes-menu",
		backdrop: true,
		title: "Simulation modes",
		content: function() { return '<p>There are three simulation modes:</p> <p><img class="output-mode-icon" src="'
		+Action.modes.roll.icon+'"> <em>Roll</em>: Yadrol rolls once and displays the result.</p> <p><img class="output-mode-icon" src="'
		+Action.modes.sample.icon+'"> <em>Sample</em>: Yadrol rolls several times and displays a distribution. This is the default mode.</p> <p><img class="output-mode-icon" src="'
		+Action.modes.advanced.icon+'"> <em>Advanced</em>: This is similar to the <em>Roll</em> mode but is used if the result is not necessarily a number.</p>' },
		placement: 'right',
		onShow: function(tour) { $('#output-modes-menu').show(); },
		onHide: function(tour) { $('#output-modes-menu').hide(); },
	},
	{
		element: "#url-button",
		backdrop: true,
		title: "Share your simulations.",
		content: "<p>This button creates an URL for the expression in the editor that you can share.</p>",
		placement: 'right'
	},
	{
		element: "#history-button",
		backdrop: true,
		title: "History of expressions.",
		content: "<p>Yadrol keeps an history of simulated rolls. This button recalls your previous expressions.</p>",
		placement: 'right'
	},
	{
		element: "#library-button",
		backdrop: true,
		title: "Import Libraries.",
		content: "<p>This button allows you to import predefined libraries of mechanics.</p>",
		placement: 'right'
	},
	{
		element: "#settings-button",
		backdrop: true,
		title: "Settings.",
		content: "<p>Here are some settings to customize Yadrol.</p>",
		placement: 'right'
	},
	{
		element: "#help-buttons",
		backdrop: true,
		title: "Help!",
		content: "<p>These buttons show help pages. <em>Tutorial</em> invokes this tour. <em>Recipes</em> are expressions for the most used mechanics. <em>Libraries</em> contains help on predefined libraries. And <em>Reference</em> contains all Yadrol constructs.</p>",
		placement: 'right'
	},
	{
		orphan: true,
		backdrop: true,
	   	template: '<div class="popover" role="tooltip"> <div class="arrow"></div> <h3 class="popover-header bg-info"></h3> <div class="popover-body"></div> <div class="popover-navigation"> <div class="btn-group"> <button class="btn btn-sm btn-info" data-role="prev">&laquo; Prev</button> <button class="btn btn-sm btn-info" data-role="next">Next &raquo;</button> <button class="btn btn-sm btn-secondary" data-role="pause-resume" data-pause-text="Pause" data-resume-text="Resume">Pause</button> </div> <button class="btn btn-sm btn-info" data-role="end">Le\'s go!</button> </div> </div>',
		title: "That's it! And now?",
		content: '<p>This is the end of the Yadrol introduction tutorial.</p> <p><strong>Enjoy!</strong></p>'
	}
	]});
Help.current = undefined;
Help.recipesContent = [
{
	title: 'Basics',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Dungeons & Dragons', 'Naturally...', false, Element.tryit('d20', 'roll'))
				),
				Element.col(
					Element.card('info', 'BRP', 'Basic RolePlaying', false, Element.tryit('d100', 'roll'))
				),
				Element.col(
					Element.card('info', 'Seldom used d8', 'Unfortunately', false, Element.tryit('d8', 'roll'))
				),
			),
			Element.row('help-row',
				Element.col(
					Element.card('info', 'd13', 'does exist', 'in the hyperdimensional irrational space. Not a problem for Yadrol', false, Element.tryit('d13', 'roll'))
				),
				Element.col(
					Element.card('info', 'Barbarians of Lemuria', 'by Simon Washbourne', false, Element.tryit('2d6', 'roll'))
				)
			),
		];
	}
},
{
	title: 'Roll & Keep',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Roll two dice', 'Keep highest', false, Element.tryit('highest of 2d10', 'roll'))
				),
				Element.col(
					Element.card('info', 'Roll two dice', 'Keep lowest', false, Element.tryit('lowest of 2d10', 'roll'))
				),
			),
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Roll three dice', 'Keep the two highest', false, Element.tryit('highest 2 of 3d6', 'roll'))
				),
				Element.col(
					Element.card('info', 'Roll three dice', 'Keep the two lowest', false, Element.tryit('lowest 2 of 3d6', 'roll'))
				),
			),
		];
	}
},
{
	title: 'Count hits',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'World of Darkness', 'Bucketful of dice', false, Element.tryit('count (for x in 6d10 if x>=7)', 'roll'))
				),
				Element.col(
					Element.card('info', 'Count 1s', 'Because one is glorious', false, Element.tryit('#(for x in 4d6 if x==1)', 'roll'))
				)
			)
		]
	}
},
{
	title: 'Exploding die',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Exploding die', 'The nice kind', false, Element.tryit('repeat (x=d6) if x==6', 'sample')), false,
				),
				Element.col(
					Element.card('info', 'Wild die', 'The savage kind', false, Element.tryit('repeat (x=d6) while x==6', 'sample')), false,
				),
				Element.col(
					Element.card('info', 'Reroll 1s', 'Because one is infamous', false, Element.tryit('last of repeat (x=d6) if x==1', 'sample')), false,
				),
			)
		]
	}
},
{
	title: 'Custom dice',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Fudge dice', 'Also: FATE', false, Element.tryit('4d[-1, -1, 0, 0, 1, 1]', 'sample'))
				),
				Element.col(
					Element.card('info', 'Shorter Fudge dice', 'With equivalent results', false, Element.tryit('4d[-1, 0, 1]', 'sample'))
				),
			)
		];
	}
},
{
	title: 'Barbarians of Lemuria damage',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'A mediocre barbarian', 'strikes with a sword', false, Element.tryit('if 2d6>=9 then d6+1 else 0', 'roll'))
				),
				Element.col(
					Element.card('info', 'A more sensible barbarian', 'strikes with a sword', false, Element.tryit('Melee=2;\nDefense=1;\nif 2d6+Melee-Defense>=9 then d6+1 else 0', 'roll'))
				),
			),
			Element.row('help-row',
				Element.col(
					Element.card('info', 'A more sensible barbarian', 'strikes with a sword', false, Element.tryit('BoL = fun(Melee, Defense) { if 2d6+Melee-Defense>=9 then d6+1 else 0 }\n---\nBoL(3, 0)', 'roll'))
				),
			)
		];
	}
},
{
	title: 'Multiple outputs',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Explicit mode', 'Overrides UI mode', false, Element.tryit('sample d20', 'roll'))
				),
				Element.col(
					Element.card('info', 'Compare two graphs', 'For science!', false, Element.tryit('sample d20; sample 3d6', 'roll'))
				),
				Element.col(
					Element.card('info', 'Roll and roll', 'roll is like sample', false, Element.tryit('roll d20; roll 3d6', 'sample'))
				),
			),
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Ad&D Strength', 'Keep rolling until hitting a 18', false, Element.tryit('if (roll 3d6)==18 then (roll d100) else undef', 'roll'))
				),
				Element.col(
					Element.card('info', 'Effect of dice pool size', 'in Roll & Keep', false, Element.tryit('(sample highest 2 of Nd6) for N in 2..7', 'sample'))
				),
			)
		];
	}
},
{
	title: 'Advanced output',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'D&D Character', 'Instantly roll a character', false,
						Element.tryit('Ability = fun() { number (3d6) }\n---\n{ STR: Ability(), DEX: Ability(), CON: Ability(), INT: Ability(), WIS: Ability(), CHA: Ability() }', 'advanced')
					)
				)
			)
		];
	}
}
];
Help.referenceContent = [
{
	title: 'Data types, literals and constructors',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Undef', undefined, false,
						Element.highlight('undef'),
						'Undef type has a single value: <em>undef</em>.'
					)
				),
				Element.col(
					Element.card('info', 'Boolean', undefined, false,
						Element.highlight('false'),
						Element.highlight('true'),
						'Boolean type has two values: <em>false</em> and <em>true</em>.'
					)
				),
				Element.col(
					Element.card('info', 'String', undefined, false,
						Element.highlight('"..."'),
						'String values are sequence of Unicode characters.'
					)
				),
				Element.col(
					Element.card('info', 'Number', undefined, false,
					 	$('<code class="cm-NUM">[+-]?[0-9]+</code>'),
						'In Yadrol, numbers are signed integer values.'
					)
				),
			),
			Element.row('help-row',
				Element.col(
					Element.card('info', 'List', undefined, false,
						Element.highlight('[ $expr$, $expr$, $...$ ]'),
						'Lists are ordered collections of expressions of any type.'
					)
				),
				Element.col(
					Element.card('info', 'Map', undefined, false,
						Element.highlight('{ name: $expr$, name: $expr$, $...$ }'),
						'Maps are ordered collections of named expressions of any type.', 'In a map, entry keys are unique.'
					)
				),
			),
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Function', undefined, false,
						Element.highlight('fun (name: $value$, name: $value$, $...$) { $body$ }'),
						'Functions are expressions that can be called and evaluated with a specific set of parameters.',
						'Function expressions are also referred as <em>lambda</em> expressions.',
						'Each argument is composed of an identifier that specifies its name, and the default value. The default value is optional. If the default vaue is specified, then it must be separated from the name with a colon.'
					)
				)
			)
		];
	}
},
{
	title: 'Natural order',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Different types', undefined, false,
						'Two values of different types are ordered as follows:',
						'undef < string < boolean < number < list < map < function'
					)
				),
				Element.col(
					Element.card('info', 'Strings', undefined, false,
						'Strings are compared according to their exicographical order.'
					)
				),
				Element.col(
					Element.card('info', 'Booleans', undefined, false,
						'false is lower than true.'
					)
				),
			),
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Numbers', undefined, false,
						'Numbers are compared according to their natural order.'
					)
				),
				Element.col(
					Element.card('info', 'Lists', undefined, false,
						'Lists are compared by their first item. If their first items are equal, then the second items are compared, etc.'
					)
				),
			),
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Maps', undefined, false,
						'Maps are compared by their first entry: their keys are compared, if they are equal, then their values are compared. If the first entries are equal, then the second entry is compared, etc.'
					)
				),
				Element.col(
					Element.card('info', 'Functions', undefined, false,
						'Functions have an unspecified but stable order.'
					)
				)
			)
		];
	}
},
{
	title: 'Data conversion',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					$('<table class="table table-bordered table-hover"></table>').append(
						$('<thead class="thead-light"></thead>').append(
							Element.tr(
								Element.th('from \\ to'),
								Element.th('string'),
								Element.th('boolean'),
								Element.th('number'),
								Element.th('list'),
								Element.th('map'),
								Element.th('function')
							)
						),
						$('<tbody></tbody>').append(
							Element.tr(
								Element.th('undef'),
								Element.td(Element.highlight('""')),
								Element.td(Element.highlight('false')),
								Element.td(Element.highlight('0')),
								Element.td(Element.highlight('[]')),
								Element.td(Element.highlight('{}')),
								Element.td(Element.highlight('fun () { undef }'))
							),
							Element.tr(
								Element.th('string'),
								Element.td(),
								Element.td(Element.highlight('$str$ != ""')),
								Element.td('Base 10, or zero'),
								Element.td(Element.highlight('[ $str$ ]')),
								Element.td(Element.highlight('{ _ : $str$ }')),
								Element.td(Element.highlight('fun () { $str$ }'))
							),
							Element.tr(
								Element.th('boolean'),
								Element.td(Element.highlight('if $bool$ then "true" else ""')),
								Element.td(),
								Element.td(Element.highlight('if $bool$ then 1 else 0')),
								Element.td(Element.highlight('[ $bool$ ]')),
								Element.td(Element.highlight('{ _ : $bool$ }')),
								Element.td(Element.highlight('fun () { $bool$ }'))
							),
							Element.tr(
								Element.th('number'),
								Element.td('Base 10'),
								Element.td(Element.highlight('$num != 0$')),
								Element.td(),
								Element.td(Element.highlight('[ $num$ ]')),
								Element.td(Element.highlight('{ _ : $num$ }')),
								Element.td(Element.highlight('fun () { $num$ }'))
							),
							Element.tr(
								Element.th('list'),
								Element.td('Concatenation'),
								Element.td(Element.highlight('#$lst$ > 0')),
								Element.td('Sum'),
								Element.td(),
								Element.td(Element.highlight('{ _0 : $lst$[0] , _1 : $lst$[1] , $...$ }')),
								Element.td(Element.highlight('fun () { $lst$ }'))
							),
							Element.tr(
								Element.th('map'),
								Element.td('Concatenation of values'),
								Element.td(Element.highlight('#$map$ > 0')),
								Element.td('Sum of values'),
								Element.td('List of values'),
								Element.td(),
								Element.td(Element.highlight('fun () { $map$ }'))
							),
							Element.tr(
								Element.th('function'),
								Element.td('Call function without argument and convert the result').attr('colspan', 6),
							)
						)
					)
				)
			)
		]
	}
},
{
	title: 'Operator precedence',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					$('<table class="table table-bordered table-hover"></table>').append(
						$('<thead class="thead-light"></thead>').append(
							Element.tr(
								Element.th('Operators'),
								Element.th('associativity')
							)
						),
						$('<tbody></tbody>').append(
							Element.tr(
								Element.td(Element.highlight('---')),
								Element.td('left')
							),
							Element.tr(
								Element.td(Element.highlight(';')),
								Element.td('left')
							),
							Element.tr(
								Element.td(Element.highlight('import roll sample as')),
								Element.td('no')
							),
							Element.tr(
								Element.td(Element.highlight('=')),
								Element.td('no')
							),
							Element.tr(
								Element.td(Element.highlight('if while limit for')),
								Element.td('no')
							),
							Element.tr(
								Element.td(Element.highlight('or')),
								Element.td('left')
							),
							Element.tr(
								Element.td(Element.highlight('and')),
								Element.td('left')
							),
							Element.tr(
								Element.td(Element.highlight('not')),
								Element.td('left')
							),
							Element.tr(
								Element.td(Element.highlight('=== !== == != < > <= >=')),
								Element.td('no')
							),
							Element.tr(
								Element.td(Element.highlight('in')),
								Element.td('no')
							),
							Element.tr(
								Element.td(Element.highlight('<<')),
								Element.td('no')
							),
							Element.tr(
								Element.td(Element.highlight('..')),
								Element.td('no')
							),
							Element.tr(
								Element.td(Element.highlight('+ -')),
								Element.td('left')
							),
							Element.tr(
								Element.td(Element.highlight('* / %')),
								Element.td('left')
							),
							Element.tr(
								Element.td(Element.highlight('+ - $(unary)$')),
								Element.td('no')
							),
							Element.tr(
								Element.td(Element.highlight('highest lowest first last')),
								Element.td('no')
							),
							Element.tr(
								Element.td(Element.highlight('draw')),
								Element.td('no')
							),
							Element.tr(
								Element.td(Element.highlight('d')),
								Element.td('left')
							),
							Element.tr(
								Element.td(Element.highlight('# sorted shuffled reversed boolean string number list map')),
								Element.td('no')
							),
							Element.tr(
								Element.td(Element.highlight('() $(call)$ . [] $(subscript)$')),
								Element.td('left')
							),
						)
					)
				)
			)
		]
	}
},
{
	title: 'Scoping',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Dynamic scoping', undefined, false,
						'Variables need not to be declared, they are declared within the scope of their first assignment.',
						'Function and loop scopes are dynamic: the scope is created at runtime.'
					)
				),
				Element.col(
					Element.card('info', 'Parent scope', undefined, false,
						'Variable values are searched within the current scope. If no variable of the specified name was found, then it is searched in the current\'s scope parent scope. The scope parents are searched until the global scope (which has no parent) is reached.',
						'If no variabe is found in the global scope, then its value is undef.',
						'Assignment works the same way: the value is assigned to the variable in the innermost scope where the variable name was defined.',
					)
				),
				Element.col(
					Element.card('info', 'Spawning scopes', undefined, false,
						'Scopes are spawned in the following constructs:',
						Element.ul(
							'<strong>Function call</strong>: a function body is evaluated in its own scope, arguments are set in this scope, the parent scope is the scope where the lambda was evaluated.',
							'<strong>Loops</strong>: loop bodies and conditions are evaluated in their own scope, the loop variable (for-loops) is set in this scope, the parent scope is the scope where the loop was initiated.',
							'<strong>Import</strong>: imported files are evaluated in their own scope, this scope has no parent.',
						)
					)
				)
			),
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Inoking scopes', undefined, false,
						Element.highlight('local'),
						Element.highlight('outer'),
						Element.highlight('global'),
						'These expressions return a scope as a map:',
						Element.ul(
							'<span class="cm-SCOPE">local</span>: returns the current scope (local variables).',
							'<span class="cm-SCOPE"></span>: returns the parent scope.',
							'<span class="cm-SCOPE"></span>: returns the global scope.',
						),
						'Changes made in the map will be visible immediately in the corresponding scope, and conversely.'
					)
				)
			)
		];
	}
},
{
	title: 'Whitespace & comments',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Whitespaces', 'don\'t count', false,
						'Whitespaces always terminate a token.',
						'All whitespace characters are equivalent: there is no difference between a space and a newline.'
					)
				),
				Element.col(
					Element.card('info', 'Comments', undefined, false,
						Element.highlight('// this is a comment'),
						'Comments run until the end of the line.'
					)
				)
			)
		];
	}
},
{
	title: 'Identifiers & Variables',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Identifiers', undefined, false,
						Element.highlight('$[A-Z_a-z][0-9A-Z_a-z]*$'),
						'Identifiers are used in the following constructs:',
						Element.ul(
							'Variable names.',
							'Entry key in map constructor.',
							'Argument name in lambda expression.',
							'Argument name in call expression.',
							'Subscript when using the dot.'
						)
					)
				),
				Element.col(
					Element.card('info', 'Variables', undefined, false,
						Element.highlight('name'),
						'A variable is named with an identifier.',
						'The value returned is that of the innermost scope that contains a value for a variable of the specified name. If none is found, then undef.'
					)
				)	
			)
		];
	}
},
{
	title: 'Function call',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Function call', undefined, false,
						Element.highlight('$fun_expr$ ( $pos_args$ , $named_args$ )'),
						Help.placeholder('fun_expr', 'an expression evluated as a function'),
						Help.placeholder('pos_args', Element.highlight('$expr$ , $expr$ , $...$')),
						Help.placeholder('named_args', Element.highlight('name : $expr$ , name : $expr$ , $...$')),
						'Evaluates the body of the function with the specified argument.',
						'The positional arguments are first set to the variables in the function scope named after the function definition.',
						'Then named arguments are set in the function scope.'
					)
				)
			)
		];
	}
},
{
	title: 'Subscript',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Bracket form', undefined, false,
						Element.highlight('$container$ [ $sub$ ]'),
						'Evaluates <em>container</em> and <em>sub</em>, then returns the part of <em>container</em> specified by <em>sub</em>.',
						'The part depends on the type of <em>sub</em>:',
						Element.ul(
							'<strong>number</strong>: <em>container</em> must be a list. The subscript returns the elemet at the index specified by <em>sub</em> (starting at zero). If the index is negative, then the index is counted starting by the end. If the index is out of the list boundaries, then the subscript returns undef.',
							'<strong>string</strong>: <em>container</em> must be a map. The suscript is the entry with the specified name. If there is no entry with this name, then undef.',
							'<strong>list</strong>: returns a list of the same size, each element is the subscript result of the corresponding subsript item.',
							'<strong>map</strong>: returns a map with the same keys, each value is the subscript result of the corresponding subscript entry.'
						),
						'A subscript of type undef, boolean or function is an error.'
					)
				),
				Element.col(
					Element.card('info', 'Dot form', undefined, false,
						Element.highlight('$container$ . name'),
						'This is equivalent to:',
						Element.highlight('$container$ [ "name" ]')
					)
				)
			)
		]
	}
},
{
	title: 'Assignment',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Assign to variable', undefined, false,
						Element.highlight('name = $rvalue$'),
						'Evaluates <em>rvalue</em> and set the variable to the result.',
						'If the variable is already set in the current scope or in one of its parents, then the variable is overwritten. Otherwise the value is set to the variable in the current scope.'
					)
				),
				Element.col(
					Element.card('info', 'Assign to list constructor', undefined, false,
						Element.highlight('[ $expr$ , $expr$ , $...$ ] = $rvalue$'),
						'Evaluates <em>rvalue</em> as a list then assign each item of the result to the corresponding <em>expr</em> in the list constructor.'
					)
				),
				Element.col(
					Element.card('info', 'Assign to map constructor', undefined, false,
						Element.highlight('{ name : $expr$ , name : $expr$ , $...$ } = $rvalue$'),
						'Evaluates <em>rvalue</em> as a map then assign each entry of the result to the corresponding <em>expr</em> in the map constructor.'
					)
				)
			)
		]
	}
},
{
	title: 'Sequences',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Soft sequence', undefined, false,
						Element.highlight('$expr$ ; $expr$ ; $...$'),
						'Evaluates all <em>expr</em> in the specified order, then returns the result of the last expression.',
						'Soft sequences are allowed in sub-expressions.'
					)
				),
				Element.col(
					Element.card('info', 'Hard sequence', undefined, false,
						Element.highlight('$expr$\n---\n$expr$\n---\n$expr$'),
						'Evaluates all <em>expr</em> in the specified order, then returns the result of the last expression.',
						'Hard sequences are only allowed at top-level. Hard sequences cannot occur in sub-expressions',
						'If no expression contains an output, then the last expression will be an implicit output.'
					)
				)
			)
		]
	}
},
{
	title: 'Conditional',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Conditional', undefined, false,
						Element.highlight('if $cond$ then $expr_true$ else $expr_false$'),
						'Evaluates <em>cond</em> as a boolean. If the result is true, then evaluates <em>expr_true</em>. Otherwise evaluates <em>expr_false</em>',
						'The else clause is mandatory.'
					)
				)
			)
		];
	}
},
{
	title: 'For loops', // 3 forms 
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Element selection', undefined, false,
						Element.highlight('for $loop_vars$ in $container$ if $cond$'),
						Help.placeholder('loop_vars', Element.highlight('name')),
						Help.placeholder('loop_vars', Element.highlight('index , name')),
						'Evaluates <em>container</em>, then assigns each element to <em>loop_vars</em> and evaluates <em>cond</em> as a boolean. The result is a container containing the elements for which <em>cond</em> is true.',
						'If <em>container</em> is a list, then the result is a list. If <em>container</em> is a map, then the result is a map.',
						'If <em>loop_vars</em> is a single identifier, then this variable is assigned to each value succesively. If <em>loop_vars</em> is two identifiers, then the first one is assigned the index in the list, or the key in the map, and the second one is assigned the values.',
						'Variables in <em>loop_vars</em> are assigned in a new scope, <em>cond</em> is evaluated in this new scope. The loop scope has the current scope as parent.'
					)
				),
				Element.col(
					Element.card('info', 'Element mapping', undefined, false,
						Element.highlight('$out$ for $loop_vars$ in $container$'),
						Help.placeholder('loop_vars', Element.highlight('name')),
						Help.placeholder('loop_vars', Element.highlight('index , name')),
						'Evaluates <em>container</em>, then assigns each element to <em>loop_vars</em> and evaluates <em>out</em>. The result is a container containing the results of the successive evaluations of <em>out</em>.',
						'If <em>container</em> is a list, then the result is a list. If <em>container</em> is a map, then the result is a map.',
						'If <em>loop_vars</em> is a single identifier, then this variable is assigned to each value succesively. If <em>loop_vars</em> is two identifiers, then the first one is assigned the index in the list, or the key in the map, and the second one is assigned the values.',
						'Variables in <em>loop_vars</em> are assigned in a new scope, <em>out</em> is evaluated in this new scope. The loop scope has the current scope as parent.'
					)
				),
			),
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Element mapping', undefined, false,
						Element.highlight('$out$ for $loop_vars$ in $container$ if $cond$'),
						Help.placeholder('loop_vars', Element.highlight('name')),
						Help.placeholder('loop_vars', Element.highlight('index , name')),
						'Evaluates <em>container</em>, then assigns each element to <em>loop_vars</em> and evaluates <em>cond</em> as a boolean and evaluates <em>out</em> for elements for which <em>cond</em> is true. The result is a container containing the results of the successive evaluations of <em>out</em>.',
						'If <em>container</em> is a list, then the result is a list. If <em>container</em> is a map, then the result is a map.',
						'If <em>loop_vars</em> is a single identifier, then this variable is assigned to each value succesively. If <em>loop_vars</em> is two identifiers, then the first one is assigned the index in the list, or the key in the map, and the second one is assigned the values.',
						'Variables in <em>loop_vars</em> are assigned in a new scope, <em>cond</em> and <em>out</em> are evaluated in this new scope. The loop scope has the current scope as parent.'
					)
				)
			)
		];
	}
},
{
	title: 'Repeat loops',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Pre-repeat', undefined, false,
						Element.highlight('while $cond$ repeat $expr$ $limit$'),
						Help.placeholder('limit', 'nothing or <span class="cm-LIMIT">limit</span> <span class="cm-NUM">num</span>'),
						'Repeatedly evaluates <em>cond</em> as a boolean, then <em>expr</em> if the result is true, stops when <em>cond</em> is false.',
						'The result is a list containing the successive results of <em>expr</em>.',
						'The <em>cond</em> and <em>expr</em> expressions are evaluated in a new scope with the current scope as parent.',
						'If <em>limit</em> is given, then the number of evaluations of <em>expr</em> is limited to the specified value.'
					)
				),
				Element.col(
					Element.card('info', 'Post-repeat', undefined, false,
						Element.highlight('repeat $expr$ while $cond$ $limit$'),
						Help.placeholder('limit', 'nothing or <span class="cm-LIMIT">limit</span> <span class="cm-NUM">num</span>'),
						'Repeatedly evaluates <em>expr</em>, then <em>cond</em> as a boolean, stops when <em>cond</em> is false.',
						'The result is a list containing the successive results of <em>expr</em>. The result has at least one item.',
						'The <em>expr</em> and <em>cond</em> expressions are evaluated in a new scope with the current scope as parent.',
						'If <em>limit</em> is given, then the number of evaluations of <em>expr</em> is limited to the specified value plus one.'			
					)
				),
				Element.col(
					Element.card('info', 'Post-repeat', undefined, false,
						Element.highlight('repeat $expr$ if $cond$'),
						'This form is equivalent to:',
						Element.highlight('repeat $expr$ while $cond$ limit 1')
					)
				),
			)
		]
	}
},
{
	title: 'Boolean operators',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Or', undefined, false,
						Element.highlight('$left$ or $right$'),
						'Evaluates <em>left</em> as a boolean. If the result is false, then evaluates <em>right</em>.'
					)
				),
				Element.col(
					Element.card('info', 'And', undefined, false,
						Element.highlight('$left$ and $right$'),
						'Evaluates <em>left</em> as a boolean. If the result is true, then evaluates <em>right</em>.'
					)
				),
				Element.col(
					Element.card('info', 'Not', undefined, false,
						Element.highlight('not $expr$'),
						'Evaluates <em>expr</em> as a boolean, and returns the opposite value.'
					)
				),
			)
		]
	}
},
{
	title: 'Comparison',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'General comparison', undefined, false,
						Element.highlight('$left$ === $right$'),
						Element.highlight('$left$ !== $right$'),
						'Evaluates <em>left</em> and <em>right</em> and returns a boolean indicating either the results are identical or not.'
					)
				),
				Element.col(
					Element.card('info', 'Numeric comparison', undefined, false,
						Element.highlight('$left$ == $right$'),
						Element.highlight('$left$ != $right$'),
						Element.highlight('$left$ < $right$'),
						Element.highlight('$left$ > $right$'),
						Element.highlight('$left$ <= $right$'),
						Element.highlight('$left$ >= $right$'),
						'Evaluates <em>left</em> and <em>right</em> as numbers, then returns either the comparison is true.'
					)
				)
			),
		]
	}
},
{
	title: 'Arithmetic',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Binary', undefined, false,
						Element.highlight('$left$ + $right$'),
						Element.highlight('$left$ - $right$'),
						Element.highlight('$left$ * $right$'),
						Element.highlight('$left$ / $right$'),
						Element.highlight('$left$ % $right$'),
						'Evaluates <em>left</em> and <em>right</em> as numbers, then returns the result of the arithmetic operation.',
						'All arithmetic operation are integer operations. <code class="cm-MULT">%</code> is the remainder of the division.'
					)
				),
				Element.col(
					Element.card('info', 'Unary', undefined, false,
						Element.highlight('+ $expr$'),
						Element.highlight('- $expr$'),
						'Evaluates <em>expr</em> as a number, then applies the specified sign.'
					)
				)
			)
		]
	}
},
{
	title: 'Dice',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Single die', undefined, false,
						Element.highlight('d $die$'),
						'Evaluates <em>die</em> and rolls a die of this type. The process of the roll depends on the type of <em>die</em>:',
						Element.ul(
							'<strong>number</strong>: returns a random number between 1 and <em>die</em>, inclusive.',
							'<strong>list</strong> or <strong>map</strong>: returns a random element of the container, undef if the container is empty.',
							'<strong>function</strong>: calls the function without any argument.'
						),
						'Rolling undef, boolean or string is an error',
						'The following constucts can be joined after the <span class="cm-DICE">d</span> operator without a space:',
						Element.ul(
							'Number literals.',
							'List and map constructors',
							'Identifiers that start with an upper case letter'
						)
					)
				),
				Element.col(
					Element.card('info', 'Multiple dice', undefined, false,
						Element.highlight('$n$ d $die$'),
						'Evaluates <em>n</em> as a number and evaluates <em>die</em>, then rolls the dice <em>n</em> times. The result is a list of size <em>n</em> containing the results of the rolls.',
						'If <em>die</em> is a function that accepts at least one argument, then this function is called only once with <em>n</em> as a single argument.',
						'The following constucts can be joined before the <span class="cm-DICE">d</span> operator without a space:',
						Element.ul(
							'Number literals',
							'List and map constructors',
							'Lambdas',
							'Function calls',
							'Single upper case letter identifiers'
						)
					)
				)
			)
		]
	}
},
{
	title: 'Draw',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Single draw', undefined, false,
						Element.highlight('draw from $expr$'),
						'Evaluates <em>expr</em> as a list, removes the first item and returns this item. Returns undef if <em>expr</em> is empty.'
					)
				),
				Element.col(
					Element.card('info', 'Multiple draw', undefined, false,
						Element.highlight('draw $n$ from $expr$'),
						'Evaluates <em>n</em> as a number and <em>expr</em> as a list, removes the <em>n</em> first items from <em>expr</em> and returns a list containing these elements.',
						'If <em>expr</em> has fewer items than <em>n</em> then returns a list containing all items and <em>expr</em> is emptied.'
					)
				)
			)
		];
	}
},
{
	title: 'Best',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Single best', undefined, false,
						Element.highlight('$selector$ of $expr$'),
						Help.placeholder('selector', Element.highlight('highest lowest first last')),
						'Evaluates <em>expr</em> as a list then returns the item specified by <em>selector</em>.',
						Element.ul(
							'<span class="cm-BEST">highest</span> selects the highest item in the list according to the natural order.',
							'<span class="cm-BEST">lowest</span> selects the lowest item in the list according to the natural order.',
							'<span class="cm-BEST">first</span> selects the first item in the list.',
							'<span class="cm-BEST">last</span> selects the last item in the list.',
						)
					)
				),
				Element.col(
					Element.card('info', 'Multiple best', undefined, false,
						Element.highlight('$selector$ $n$ of $expr$'),
						Help.placeholder('selector', Element.highlight('highest lowest first last')),
						'Evaluates <em>n</em> as a number and <em>expr</em> as a list then returns a list of items specified by <em>selector</em>.',
						'Even if <em>selector</em> is <span class="cm-BEST">highest</span> or <span class="cm-BEST">lowest</span>, the items in the result list are in the same order than in <em>expr</em>.'
					)
				)
			),
		];
	}
},
{
	title: 'List tools',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Count', undefined, false,
						Element.highlight('# $expr$'),
						Element.highlight('count $expr$'),
						'Evaluates <em>expr</em> and returns the number of elements depending on the type:',
						Element.ul(
							'<strong>undef</strong>: returns zero.',
							'<strong>string</strong>, <strong>boolean</strong>, <strong>number</strong>: returns 1.',
							'<strong>list</strong>: returns the number of elements in the list.',
							'<strong>map</strong>: returns the number of entries in the map.',
						),
						'Counting a function is an error.'
					)
				),
				Element.col(
					Element.card('info', 'Append', undefined, false,
						Element.highlight('$target$ << $source$'),
						'Evaluates <em>source</em> and <em>target</em>, appends the result of <em>target</em> to <em>target</em>, then returns <em>source</em>.',
						'If <em>target</em> is a list, then <em>source</em> is evaluated as a list, and all items are appended at the end of <em>target</em>.',
						'If <em>target</em> is a map, then <em>source</em> is evaluated as a map, and each entry is added to <em>target</em>. If an entry key already exists in <em>target</em>, then the value is overwritten.'
					)
				),
				Element.col(
					Element.card('info', 'Reorder', undefined, false,
						Element.highlight('sort $expr$'),
						Element.highlight('reverse $expr$'),
						Element.highlight('shuffle $expr$'),
						'Evaluates <em>expr</em> as a list, changes the order of items in place and returns it.',
						'The order depends on the selector:',
						Element.ul(
							'<strong>sort</strong>: sort items according to the natural order.',
							'<strong>reverse</strong>: reverse the items (first becomes last, etc.)',
							'<strong>shuffle</strong>: place the items in a random order.'
						)
					)
				)
			)
		];
	}
},
{
	title: 'Range',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Range', undefined, false,
						Element.highlight('$start$ .. $end$'),
						'Evaluates <em>start</em> and <em>end</em> as numbers, then returns a list containing all numbers between <em>start</em> and <em>end</em>, inclusive.',
						'If <em>start</em> is higher than <em>end</em>, then the items in the list are in reverse order.'
					)
				)
			)
		];
	}
},
{
	title: 'Conversion', // conversion
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Conversion', undefined, false,
						Element.highlight('$type$ $expr$'),
						Help.placeholder('type', Element.highlight('string boolean number list map')),
						'Forces the evaluation of <em>expr</em> as the specified <em>type</em>.'
					)
				)
			)
		]
	}
},
{
	title: 'Output',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Output', undefined, false,
						Element.highlight('roll $expr$'),
						Element.highlight('roll $expr$ as $type$ "label"'),
						Element.highlight('sample $expr$'),
						Element.highlight('sample $expr$ as $type$ "label"'),
						Help.placeholder('type', Element.highlight('string boolean number list map')),
						'Indicates to the Yadrol application that the evaluation of <em>expr</em> must be recorded and displayed.',
						Element.ul(
							'<span class="cm-OUTPUT">roll</span> indicates a single evaluation. The result should be displayed and the dice rolls recorded.',
							'<span class="cm-OUTPUT">sample</span> indeicates a repeated evaluation. The distribution of the results should be displayed but the dice rolls should not be recorded.',
						),
						'Nested outputs are an error, <em>expr</em> cannot contain an output expression.',
						'Output expressions can be followed with the <span class="cm-AS">as</span> clause with a string literal and/or a type.',
						'The string literal specifies the application the label of the displayed result, by default the application will label the result with a string representation of <em>expr</em>.',
						'The <em>type</em> indicates that the result must be converted to the specified type. By default, <em>expr</em> is evaluated as a number in&nbsp;<img class="output-mode-icon" src="'+Action.modes.roll.icon+'">Roll and&nbsp;<img class="output-mode-icon" src="'+Action.modes.sample.icon+'">Sample modes. In&nbsp;<img class="output-mode-icon" src="'+Action.modes.advanced.icon+'">Advanced mode, <em>expr</em> is not converted and evaluated as its native type.',
						'Output expressions return undef'
					)
				)
			)
		]
	}
},
{
	title: 'Import',
	body: function() {
		return [
			Element.row('help-row',
				Element.col(
					Element.card('info', 'Import', undefined, false,
						Element.highlight('import "address"'),
						Element.highlight('import name = "address"'),
						'Retrives a source specified by <span class="cm-STR">address</span>, evaluates the content of this source in a new global scope, then merges this scope to the current scope.',
						'The <span class="cm-STR">address</span> must be an URL to a file that contains a top-level expression (hard breaks allowed).',
						'Within a single session, imports are cached, subsequent imports of an already imported address will not fetch the source again.',
						'If <em>name</em> is given, then the imported scope will not be merged but assigned as a map to the specified variable.',
						'Import expressions return undef.'
					)
				)
			)
		]
	}
},
];







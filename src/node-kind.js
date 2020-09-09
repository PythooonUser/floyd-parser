/** Stores information about the kind of Node object. */
class NodeKind {}

// Source Document Node
NodeKind.SourceDocumentNode = "NodeKind.SourceDocumentNode";

// Statement Nodes
NodeKind.ClassDeclarationNode = "NodeKind.ClassDeclarationNode";
NodeKind.ClassBaseClauseNode = "NodeKind.ClassBaseClauseNode";
NodeKind.ClassMembersNode = "NodeKind.ClassMembersNode";
NodeKind.WhileStatementNode = "NodeKind.WhileStatementNode";
NodeKind.ExpressionStatementNode = "NodeKind.ExpressionStatementNode";
NodeKind.VerbStatementNode = "NodeKind.VerbStatementNode";

// Expression Nodes
NodeKind.UnaryOperatorExpressionNode = "NodeKind.UnaryOperatorExpressionNode";
NodeKind.UnaryExpressionNode = "NodeKind.UnaryExpressionNode";
NodeKind.ExpressionNode = "NodeKind.ExpressionNode";
NodeKind.VariableNode = "NodeKind.VariableNode";
NodeKind.AttributeNode = "NodeKind.AttributeNode";
NodeKind.BinaryExpressionNode = "NodeKind.BinaryExpressionNode";
NodeKind.ParenthesizedExpressionNode = "NodeKind.ParenthesizedExpressionNode";
NodeKind.PrefixUpdateExpressionNode = "NodeKind.PrefixUpdateExpressionNode";
NodeKind.MemberAccessExpressionNode = "NodeKind.MemberAccessExpressionNode";
NodeKind.StringLiteralNode = "NodeKind.StringLiteralNode";
NodeKind.NumberLiteralNode = "NodeKind.NumberLiteralNode";

exports.NodeKind = NodeKind;

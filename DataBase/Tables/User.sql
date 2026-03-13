CREATE TABLE [dbo].[User]
(
  [UserId] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
  [UserName] VARCHAR(200) NOT NULL UNIQUE,
  [Email] VARCHAR(200) NOT NULL,
  [Role] VARCHAR(100) NOT NULL,
  [IsActive] BIT DEFAULT 1,
  [CreatedAt] DATETIME NOT NULL,
  [UpdatedAt] DATETIME NOT NULL,
  [CreatedBy] UNIQUEIDENTIFIER NULL,
  [UpdatedBy] UNIQUEIDENTIFIER NULL,
  CONSTRAINT [FK_User_CreatedBy] FOREIGN KEY ([CreatedBy]) REFERENCES [dbo].[User]([UserId]),
  CONSTRAINT [FK_User_UpdatedBy] FOREIGN KEY ([UpdatedBy]) REFERENCES [dbo].[User]([UserId]),
  CONSTRAINT [CHK_User_Role] CHECK ([Role] IN ('admin', 'user'))
)

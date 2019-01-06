{-# LANGUAGE DeriveGeneric #-}

import Web.Scotty
import Data.Aeson (FromJSON, ToJSON)
import GHC.Generics
import Database.PostgreSQL.Simple
import Network.HTTP.Types.Status
import Control.Monad.IO.Class (liftIO)
import System.Environment (getEnv)
import Data.ByteString.Char8

data Question =
    Question { name :: String, question :: String } deriving (Show, Generic)
instance ToJSON Question
instance FromJSON Question

main :: IO ()
main = do
    portString <- getEnv "PORT"
    dbConnectionString <- getEnv "DB_CONNECTION_STRING"
    let port = read portString :: Int
    scotty port $ app $ pack dbConnectionString

insertQuestion :: ByteString -> Question -> IO ()
insertQuestion dbConnectionString q = do
    let sql = "insert into questions (name, question) values (?, ?)"
    conn <- connectPostgreSQL dbConnectionString
    execute conn sql (name q, question q)
    return ()

app :: ByteString -> ScottyM ()
app dbConnectionString = post "/" $ do
  ques <- jsonData :: ActionM Question
  liftIO $ insertQuestion dbConnectionString ques
  status $ mkStatus 201 "Created"


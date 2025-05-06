import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'getStatusProvider' : ActorMethod<[], string>,
  'save_my_profile' : ActorMethod<
    [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      Array<
        {
          'setting' : boolean,
          'icon' : string,
          'link' : string,
          'name' : string,
          'type_button' : string,
        }
      >,
      Array<{ 'link' : string, 'platform' : string }>,
      Array<{ 'icon' : string, 'tags' : string }>,
    ],
    {
        'Ok' : {
          'bio' : string,
          'verified' : boolean,
          'country' : string,
          'banner_url' : string,
          'avatar_url' : string,
          'link' : string,
          'name' : string,
          'tags' : Array<{ 'icon' : string, 'tags' : string }>,
          'created_at' : string,
          'typechain' : string,
          'address' : string,
          'user_banned' : boolean,
          'media_social' : Array<{ 'link' : string, 'platform' : string }>,
          'button' : Array<
            {
              'setting' : boolean,
              'icon' : string,
              'link' : string,
              'name' : string,
              'type_button' : string,
            }
          >,
        }
      } |
      { 'Err' : string }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
